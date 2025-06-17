# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a PNPM monorepo containing:
- `client/` - Next.js 15 app (T3 stack) for the frontend
- `contracts/` - Hardhat project for smart contracts

## Commands

### Client (Next.js app)
```bash
cd client
pnpm dev              # Start development server
pnpm build            # Build production app
pnpm check            # Run lint and typecheck
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript type checking
pnpm format:write     # Format code with Prettier
```

### Contracts (Hardhat)
```bash
cd contracts
npx hardhat test      # Run all tests
npx hardhat compile   # Compile contracts
npx hardhat coverage  # Generate test coverage report
```

### Root
```bash
pnpm install          # Install dependencies for all workspaces
```

## Architecture

### Client Application
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Web3**: Thirdweb SDK for blockchain interactions
- **State Management**: TanStack Query for server state
- **Payment**: Wert widget integration for crypto purchases

Key directories:
- `src/app/` - Next.js App Router pages
- `src/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks for blockchain interactions
- `src/lib/` - Utility functions and configurations
- `src/config/` - Contract addresses and configurations
- `src/constants/` - Static data and constants

### Smart Contracts
- **OWN Token**: ERC20 token implementation
- **Presale**: Token presale functionality with rounds
- **Staking**: OWN token staking with rewards
- **veOWN**: Voting escrow implementation
- **Framework**: Hardhat with OpenZeppelin upgradeable contracts

### Styling Conventions
- Use `cn()` utility for conditional classes: `cn({"class-name": condition})`
- Avoid ternary operators in className props
- Follow shadcn/ui component patterns

### Web3 Integration
- Uses Thirdweb v5 for wallet connections and contract interactions
- Contract addresses stored in `client/src/config/contracts.ts`
- Custom hooks in `client/src/hooks/` wrap contract calls
- Supports Arbitrum and Sepolia networks

### Environment Variables
- Client env vars prefixed with `NEXT_PUBLIC_`
- Server env vars validated with Zod in `client/src/env.ts`
- Thirdweb and Wert API keys required for full functionality