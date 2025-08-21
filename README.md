# fasset

### client/

This is a next app created via [create t3 app.](https://create.t3.gg/).

### contracts/

This is a hardhat project that contains the contracts related to:

- OWN Token
- OWN Staking

There is also a client requirement of using sablier to vest, however, at the time of writing this is still being decided. The client has been informed of this, and there will be more info soon.

So far at the time of writing this, a user can stake their tokens, but the rewards calculation for a given users stake is not yet complete. You can find more specification on how this is meant to function [here](https://www.notion.so/labrys/Staking-Scoping-Notes-17bced2a7e1380f4af67cc2ef2423a77):

# Deployment

When deploying to Ethereum we will need to:
- Update the contract addresses to use USDT
- Update the wert integration to use USDT

# Contract Documentation

## OWN Token (OWN.sol)

**Overview**: The OWN token is an upgradeable ERC20 token that serves as the primary utility token for the ecosystem.

**Key Features**:
- **ERC20 Standard**: Full ERC20 compatibility with transfer, approve, and allowance functionality
- **Burnable**: Tokens can be permanently removed from circulation via burn functionality
- **Upgradeable**: UUPS proxy pattern for future contract improvements
- **Access Control**: Role-based permissions for administrative functions

**Technical Details**:
- **Total Supply**: 2.25 billion tokens minted at initialization
- **Decimals**: 18 (standard ERC20)
- **Upgrade Authorization**: Restricted to DEFAULT_ADMIN_ROLE

**Inheritance Chain**:
- OpenZeppelin's upgradeable contracts for security and standards compliance
- AccessControlUpgradeable for role management
- UUPSUpgradeable for upgrade functionality

**Security Features**:
- Initializer protection against multiple initialization
- Role-based access control for sensitive operations
- Zero address validation for critical parameters

## veOWN Token (veOWN.sol)

**Overview**: veOWN is a vote-escrowed token that represents voting power and staking positions within the ecosystem. It's a non-transferable token whose balance is dynamically calculated based on active stakes in the staking contract.

**Key Features**:
- **Vote Escrowed**: Token balance represents voting power derived from locked OWN tokens
- **Non-Transferable**: Transfer and transferFrom functions are disabled to prevent trading
- **Dynamic Balance**: Balance calculated in real-time from active staking positions
- **Staking Integration**: Tightly coupled with the Stake contract for balance calculations
- **Time-Weighted**: Longer lock periods generate more veOWN (1 OWN × weeks locked = veOWN amount)

**Technical Architecture**:
- **Balance Calculation**: `balanceOf()` queries the staking contract's `getUsersActiveVeOwnBalance()`
- **Total Supply**: `totalSupply()` aggregates all active veOWN across all users via staking contract
- **No Direct Minting**: veOWN is not minted/burned directly - balances are computed from staking positions
- **Proxy Pattern**: Uses UUPS upgradeable proxy for future enhancements

**Staking Relationship**:
- **veOWN Generation**: When users stake OWN tokens, they receive veOWN = staked_amount × lock_weeks
- **Active Positions**: Only considers staking positions that are currently within their lock period
- **Reward Calculations**: veOWN balance determines proportional share of daily staking rewards
- **Position Expiry**: veOWN balance automatically decreases as staking positions expire

**Use Cases**:
- **Governance Voting**: veOWN balance determines voting power in DAO proposals
- **Reward Distribution**: Higher veOWN = larger share of daily staking rewards
- **Incentive Alignment**: Encourages longer-term staking commitments

**Security Features**:
- **Transfer Protection**: Explicit revert on transfer attempts to maintain non-transferable nature
- **Authorized Integration**: Only designated staking contract can influence balance calculations
- **Upgrade Security**: Admin-controlled upgrades with proper access controls

## Presale Contract (Presale.sol)

**Overview**: The Presale contract manages multiple sequential token sale rounds with configurable parameters, allowing users to purchase OWN tokens with USDT. It includes comprehensive admin controls and protection mechanisms.

**Key Features**:
- **Multi-Round System**: Support for multiple sequential presale rounds with different pricing and allocations
- **USDT Payments**: Users purchase tokens using USDT, with automatic price calculations
- **Delayed Claims**: Token claims are delayed until a configurable timestamp after each round ends
- **Admin Controls**: Comprehensive management tools for round configuration and fund recovery
- **Upgrade Protection**: Immutable round parameters once rounds have started or completed

**Presale Round System**:
- **Round Structure**: Each round has duration, price (USDT per OWN), allocation, and claim timestamp
- **Sequential Execution**: Rounds run sequentially based on configured durations
- **Dynamic Pricing**: Each round can have different token prices and allocations
- **Automatic Progression**: System automatically moves to next round when current round duration expires
- **Sell-Through Tracking**: Tracks sales vs allocation for each round individually

**Admin Management Methods**:
- **`addPresaleRounds()`**: Add new future presale rounds (validates sufficient OWN balance)
- **`updatePresaleRoundDuration()`**: Modify duration of future rounds only
- **`updatePresaleRoundPrice()`**: Adjust pricing for future rounds only
- **`updatePresaleRoundAllocation()`**: Change token allocation for future rounds only
- **`updatePresaleRoundClaimTimestamp()`**: Set when users can claim tokens from each round
- **`setPresaleStartTime()`**: Set global presale start time (only before presale begins)

**Round Update Restrictions**:
- **Future Rounds Only**: Can only update rounds that haven't started yet
- **No Active Round Updates**: Cannot modify currently active rounds or completed rounds
- **Start Time Lock**: Once presale starts, start time cannot be changed
- **Validation Requirements**: All updates must pass validation (non-zero values, sufficient balances)

**Token Claiming System**:
- **Delayed Claims**: Users can only claim tokens after the round's `claimTokensTimestamp`
- **Batch Claims**: Users can claim tokens from multiple rounds in a single transaction
- **Purchase Tracking**: Individual purchases are tracked with round ID, amounts, and claim status
- **Progressive Claims**: Can claim from completed rounds while later rounds are still active

**Admin Token Recovery**:
- **`claimBackPresaleTokens()`**: Admin can reclaim unsold tokens with restrictions:
  - **Only When Inactive**: Cannot claim while any presale round is in progress
  - **Respects User Claims**: Only claims `contract_balance - (total_sales - total_claims)`
  - **Protects User Funds**: Ensures users can always claim their purchased tokens
- **`claimUSDT()`**: Admin can withdraw accumulated USDT payments at any time

**Purchase Flow**:
1. **Round Validation**: Checks if presale is active and round is in progress
2. **Price Calculation**: Converts USDT amount to OWN tokens based on current round price
3. **Allocation Check**: Ensures sufficient tokens remain in current round
4. **Purchase Recording**: Creates PresalePurchase record with round ID and amounts
5. **USDT Transfer**: Transfers USDT from user to contract
6. **Sales Tracking**: Updates round sales and global sales counters

**Security Features**:
- **Immutable Active Rounds**: Once rounds start, their parameters cannot be changed
- **Balance Validation**: Ensures contract has sufficient OWN tokens for all configured rounds
- **Claim Protection**: Prevents admin from claiming tokens that belong to users
- **Zero Address Protection**: Validates all address parameters to prevent misconfigurations
- **Reentrancy Protection**: Uses OpenZeppelin's upgradeable contracts for security

**Technical Details**:
- **Price Format**: USDT price per OWN token (scaled appropriately for decimals)
- **Time Management**: Uses block.timestamp for all time-based operations
- **Batch Operations**: Supports batch claiming and round additions for efficiency
- **Event Logging**: Comprehensive event emission for all major operations

## Staking Contract (Stake.sol)

**Overview**: The Staking contract enables users to lock OWN tokens for specified periods to earn rewards and generate veOWN voting power. It features a sophisticated reward distribution system with weekly caching, boost multipliers, and integration with Sablier for reward streaming.

**Key Features**:
- **Time-Locked Staking**: Lock OWN tokens for 7-364 days (1-52 weeks) to earn rewards
- **veOWN Generation**: Staked tokens generate veOWN = staked_amount × lock_weeks for governance
- **Proportional Rewards**: Weekly rewards distributed proportionally based on veOWN balance
- **Boost System**: Temporary reward multipliers for specified periods
- **Emergency Withdrawal**: Users can withdraw principal early (forfeit unclaimed rewards)
- **Sablier Integration**: Reward distribution via Sablier streaming for predictable payouts

**Staking Mechanics**:
- **Lock Period**: 7 days minimum, 364 days maximum (weekly increments)
- **veOWN Calculation**: `veOWN = ownAmount × (lockDays ÷ 7)`
- **Reward Start**: Rewards begin the day after staking (not immediately)
- **Position Tracking**: Each stake creates a unique position with individual parameters
- **Multiple Positions**: Users can have multiple concurrent staking positions

**Reward Distribution System**:
- **Weekly Rewards**: Total weekly rewards = `dailyRewardAmount × 7`
- **Proportional Share**: User reward = `(user_veOWN ÷ total_veOWN) × weekly_rewards`
- **Weekly Caching**: Reward calculations cached weekly for gas efficiency
- **Claimable Timing**: Rewards claimable after each week completes
- **Boost Multipliers**: Temporary multipliers can increase rewards for specific periods

**Admin Controls**:
- **`startStakingNextWeek()`**: Initialize staking (requires daily reward amount to be set)
- **`setDailyRewardAmount()`**: Set/update daily reward distribution amount
- **`setMaximumDailyRewardAmount()`**: Set ceiling for daily reward amounts
- **`setSablierStreamId()`**: Configure Sablier stream for reward distribution
- **`addBoostDetails()`**: Add a boost multiplier for a given start week and duration in weeks

**User Functions**:
- **`stake(amount, days)`**: Lock tokens for specified period and generate veOWN
- **`claimRewards(positionIds[])`**: Claim accumulated rewards from specified positions
- **`emergencyWithdrawStakePrinciple(positionIds[])`**: Early withdrawal of principal (forfeit rewards)

**Position Management**:
- **StakePosition Structure**: Tracks owner, amounts, dates, and reward history
- **Individual Tracking**: Each position independently tracks rewards and expiration
- **Batch Operations**: Multiple positions can be managed in single transactions
- **Automatic Expiry**: Positions automatically expire after lock period ends

**Reward Calculation Flow**:
1. **Weekly Caching**: System calculates and caches reward values each week
2. **veOWN Tracking**: Daily additions/subtractions of veOWN tracked for accuracy
3. **Proportional Distribution**: Rewards distributed based on veOWN share of total supply
4. **Boost Application**: Multipliers applied during designated boost periods
5. **Individual Claims**: Users claim rewards from their active positions

**Emergency Features**:
- **Emergency Withdrawal**: Users can withdraw staked principal at any time
- **Reward Forfeiture**: Early withdrawal forfeits all unclaimed rewards for those positions
- **Position Invalidation**: Emergency withdrawal invalidates position for future rewards
- **Principal Protection**: Always allows users to recover their staked tokens

**Boost System**:
- **Temporary Multipliers**: Admin can set reward multipliers for specific weeks
- **Configurable Duration**: Boosts can last for specified number of weeks
- **Multiplier Effects**: Boosts multiply base reward amounts during active periods
- **Retroactive Application**: Boosts apply to all eligible positions during boost period

**Integration Architecture**:
- **veOWN Contract**: Queries staking contract for dynamic balance calculations
- **Sablier Streaming**: Integrates with Sablier for predictable reward distribution
- **OWN Token**: Securely holds and manages staked OWN tokens
- **Weekly Cadence**: All operations aligned on weekly boundaries for consistency

**Technical Optimizations**:
- **Weekly Caching**: Gas-efficient reward calculations through weekly result caching
- **Batch Processing**: Support for multiple position operations in single transaction
- **Reentrancy Protection**: SafeERC20 and ReentrancyGuard for security
- **Access Control**: Role-based permissions for administrative functions

**Time Management**:
- **Day-Based Tracking**: All positions tracked by day for precise reward calculations
- **Week Boundaries**: Reward calculations and claims aligned to weekly periods
- **Automatic Progression**: System automatically handles position expiry and veOWN decay
- **Current Time Functions**: `getCurrentDay()` and `getCurrentWeek()` provide consistent time reference

**Security Features**:
- **Position Ownership**: Only position owners can claim rewards or withdraw
- **Balance Validation**: Ensures sufficient contract balance for all operations
- **Upgrade Protection**: Admin-controlled upgrades with proper access controls
- **Emergency Safeguards**: Users always retain ability to recover their principal

