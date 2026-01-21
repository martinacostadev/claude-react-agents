#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates')

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
}

function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`)
}

function logStep(step, message) {
  console.log(`${colors.cyan}[${step}]${colors.reset} ${message}`)
}

function logSuccess(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`)
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`)
}

function logError(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`)
}

// Create readline interface for user input
function createPrompt() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
}

async function question(rl, query) {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function confirm(rl, query) {
  const answer = await question(rl, `${query} (y/n): `)
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes'
}

async function select(rl, query, options) {
  console.log(`\n${query}`)
  options.forEach((opt, i) => {
    console.log(`  ${colors.cyan}${i + 1}${colors.reset}) ${opt.label}`)
  })
  const answer = await question(rl, `\nSelect (1-${options.length}): `)
  const index = parseInt(answer) - 1
  if (index >= 0 && index < options.length) {
    return options[index].value
  }
  return options[0].value
}

// Detect project type from package.json
function detectProjectType(targetDir) {
  const packageJsonPath = path.join(targetDir, 'package.json')

  if (!fs.existsSync(packageJsonPath)) {
    return { type: 'unknown', framework: null }
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }

    const hasNext = 'next' in deps
    const hasExpo = 'expo' in deps
    const hasReactNative = 'react-native' in deps

    if (hasNext && (hasExpo || hasReactNative)) {
      return { type: 'both', framework: 'next+expo' }
    } else if (hasNext) {
      return { type: 'web', framework: 'nextjs' }
    } else if (hasExpo) {
      return { type: 'mobile', framework: 'expo' }
    } else if (hasReactNative) {
      return { type: 'mobile', framework: 'react-native' }
    }

    return { type: 'unknown', framework: null }
  } catch {
    return { type: 'unknown', framework: null }
  }
}

// Copy directory recursively with filtering
function copyDir(src, dest, filter = () => true) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (!filter(entry.name, srcPath)) {
      continue
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, filter)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// Install configuration
async function install(targetDir, options) {
  const { projectType, includeWeb, includeMobile } = options

  logStep('1/4', 'Creating .claude directory...')

  const claudeDir = path.join(targetDir, '.claude')
  const templateClaudeDir = path.join(TEMPLATES_DIR, '.claude')

  // Create .claude directory
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true })
  }

  // Filter function for selective copying
  const filter = (name, srcPath) => {
    // Always include shared
    if (srcPath.includes('shared')) return true

    // Filter web/mobile based on options
    if (srcPath.includes(path.sep + 'web' + path.sep) || srcPath.endsWith(path.sep + 'web')) {
      return includeWeb
    }
    if (srcPath.includes(path.sep + 'mobile' + path.sep) || srcPath.endsWith(path.sep + 'mobile')) {
      return includeMobile
    }

    // Filter rules
    if (name === 'nextjs.md') return includeWeb
    if (name === 'expo.md') return includeMobile

    return true
  }

  // Copy agents
  logStep('2/4', 'Installing agents...')
  copyDir(
    path.join(templateClaudeDir, 'agents'),
    path.join(claudeDir, 'agents'),
    filter
  )

  // Copy skills
  logStep('3/4', 'Installing skills...')
  copyDir(
    path.join(templateClaudeDir, 'skills'),
    path.join(claudeDir, 'skills'),
    filter
  )

  // Copy rules
  copyDir(
    path.join(templateClaudeDir, 'rules'),
    path.join(claudeDir, 'rules'),
    filter
  )

  // Copy hooks
  copyDir(
    path.join(templateClaudeDir, 'hooks'),
    path.join(claudeDir, 'hooks')
  )

  // Copy settings
  fs.copyFileSync(
    path.join(templateClaudeDir, 'settings.json'),
    path.join(claudeDir, 'settings.json')
  )
  fs.copyFileSync(
    path.join(templateClaudeDir, 'settings.local.json.example'),
    path.join(claudeDir, 'settings.local.json.example')
  )

  // Copy CLAUDE.md
  logStep('4/4', 'Installing CLAUDE.md...')
  fs.copyFileSync(
    path.join(TEMPLATES_DIR, 'CLAUDE.md'),
    path.join(targetDir, 'CLAUDE.md')
  )

  // Update .gitignore
  const gitignorePath = path.join(targetDir, '.gitignore')
  const gitignoreEntry = '\n# Claude Code local settings\n.claude/settings.local.json\n'

  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, 'utf8')
    if (!content.includes('settings.local.json')) {
      fs.appendFileSync(gitignorePath, gitignoreEntry)
      logSuccess('Updated .gitignore')
    }
  } else {
    fs.writeFileSync(gitignorePath, gitignoreEntry.trim())
    logSuccess('Created .gitignore')
  }

  return true
}

// Print summary
function printSummary(options) {
  const { includeWeb, includeMobile } = options

  console.log('\n' + '═'.repeat(50))
  log('\n✅ Installation complete!\n', colors.green + colors.bright)

  console.log('Installed components:')
  console.log('─'.repeat(30))

  console.log(`\n${colors.cyan}Agents:${colors.reset}`)
  console.log('  • code-reviewer (shared)')
  console.log('  • architect (shared)')
  console.log('  • tester (shared)')
  console.log('  • refactorer (shared)')
  if (includeWeb) {
    console.log('  • nextjs-developer (web)')
    console.log('  • api-developer (web)')
  }
  if (includeMobile) {
    console.log('  • expo-developer (mobile)')
    console.log('  • native-module-developer (mobile)')
  }

  console.log(`\n${colors.cyan}Skills (Commands):${colors.reset}`)
  console.log('  • /commit')
  console.log('  • /review')
  console.log('  • /test')
  if (includeWeb) {
    console.log('  • /new-page')
    console.log('  • /new-api')
    console.log('  • /new-component')
  }
  if (includeMobile) {
    console.log('  • /new-screen')
    console.log('  • /new-feature')
  }

  console.log(`\n${colors.cyan}Rules Applied:${colors.reset}`)
  console.log('  • TypeScript strict mode')
  console.log('  • React best practices')
  console.log('  • Security standards')
  console.log('  • Testing standards')
  if (includeWeb) console.log('  • Next.js App Router patterns')
  if (includeMobile) console.log('  • Expo/React Native patterns')

  console.log(`\n${colors.yellow}Recommended next steps:${colors.reset}`)
  console.log('─'.repeat(30))

  console.log('\n1. Install additional skills:')
  if (includeWeb) {
    console.log(`   ${colors.dim}npx skills add vercel-labs/agent-skills${colors.reset}`)
  }
  if (includeMobile) {
    console.log(`   ${colors.dim}npx skills add expo/skills${colors.reset}`)
  }

  console.log('\n2. (Optional) Create local settings:')
  console.log(`   ${colors.dim}cp .claude/settings.local.json.example .claude/settings.local.json${colors.reset}`)

  console.log('\n3. Start Claude Code in your project!')
  console.log(`   ${colors.dim}claude${colors.reset}`)

  console.log('\n' + '═'.repeat(50) + '\n')
}

// Main CLI function
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  // Show help
  if (!command || command === '--help' || command === '-h') {
    console.log(`
${colors.cyan}${colors.bright}Claude React Agents${colors.reset}
Professional Claude Code configuration for React projects

${colors.yellow}Usage:${colors.reset}
  npx claude-react-agents init [options]    Initialize in current directory
  npx claude-react-agents init <path>       Initialize in specified path

${colors.yellow}Options:${colors.reset}
  --web         Install only web (Next.js) configuration
  --mobile      Install only mobile (Expo) configuration
  --force       Overwrite existing .claude directory
  --yes, -y     Skip confirmation prompts

${colors.yellow}Examples:${colors.reset}
  npx claude-react-agents init
  npx claude-react-agents init ./my-project
  npx claude-react-agents init --web
  npx claude-react-agents init --mobile --force
`)
    process.exit(0)
  }

  // Version
  if (command === '--version' || command === '-v') {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))
    console.log(pkg.version)
    process.exit(0)
  }

  // Init command
  if (command === 'init') {
    console.log(`
${colors.cyan}╔════════════════════════════════════════════════╗
║         Claude React Agents Installer          ║
╚════════════════════════════════════════════════╝${colors.reset}
`)

    // Parse options
    const hasWebFlag = args.includes('--web')
    const hasMobileFlag = args.includes('--mobile')
    const forceFlag = args.includes('--force')
    const yesFlag = args.includes('--yes') || args.includes('-y')

    // Determine target directory
    let targetDir = process.cwd()
    const pathArg = args.find(a => !a.startsWith('--') && a !== 'init')
    if (pathArg) {
      targetDir = path.resolve(pathArg)
    }

    // Check if target exists
    if (!fs.existsSync(targetDir)) {
      logError(`Directory not found: ${targetDir}`)
      process.exit(1)
    }

    log(`Target directory: ${targetDir}`, colors.dim)

    // Check for existing .claude
    const claudeDir = path.join(targetDir, '.claude')
    if (fs.existsSync(claudeDir) && !forceFlag) {
      logWarning('.claude directory already exists')
      if (!yesFlag) {
        const rl = createPrompt()
        const overwrite = await confirm(rl, 'Overwrite existing configuration?')
        rl.close()
        if (!overwrite) {
          log('\nAborted.', colors.yellow)
          process.exit(0)
        }
      }
      fs.rmSync(claudeDir, { recursive: true })
    }

    // Detect project type
    const detected = detectProjectType(targetDir)
    log(`\nDetected project: ${detected.framework || 'unknown'}`, colors.dim)

    // Determine what to install
    let includeWeb = hasWebFlag || (!hasMobileFlag && !hasWebFlag)
    let includeMobile = hasMobileFlag || (!hasMobileFlag && !hasWebFlag)

    // If neither flag provided and not auto-confirm, ask user
    if (!hasWebFlag && !hasMobileFlag && !yesFlag) {
      const rl = createPrompt()

      // If we detected a specific type, suggest it
      if (detected.type === 'web') {
        log('\nNext.js project detected!', colors.green)
        includeMobile = await confirm(rl, 'Also include mobile (Expo) configuration?')
      } else if (detected.type === 'mobile') {
        log('\nExpo/React Native project detected!', colors.green)
        includeWeb = await confirm(rl, 'Also include web (Next.js) configuration?')
      } else if (detected.type === 'both') {
        log('\nMonorepo with both Next.js and Expo detected!', colors.green)
      } else {
        // Ask user to choose
        const choice = await select(rl, 'What type of project is this?', [
          { label: 'Both Web (Next.js) and Mobile (Expo)', value: 'both' },
          { label: 'Web only (Next.js)', value: 'web' },
          { label: 'Mobile only (Expo/React Native)', value: 'mobile' },
        ])

        includeWeb = choice === 'both' || choice === 'web'
        includeMobile = choice === 'both' || choice === 'mobile'
      }

      rl.close()
    }

    console.log('')

    // Run installation
    const success = await install(targetDir, {
      projectType: detected.type,
      includeWeb,
      includeMobile,
    })

    if (success) {
      printSummary({ includeWeb, includeMobile })
    }

    process.exit(0)
  }

  // Unknown command
  logError(`Unknown command: ${command}`)
  console.log('Run with --help for usage information')
  process.exit(1)
}

main().catch((err) => {
  logError(err.message)
  process.exit(1)
})
