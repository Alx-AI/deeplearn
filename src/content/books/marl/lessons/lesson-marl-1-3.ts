/**
 * Lesson 1.3: MARL Application Examples
 *
 * Covers: Multi-robot warehouse management, competitive game AI, autonomous
 * driving, and automated trading
 * Source sections: 1.3 (all sub-sections: 1.3.1 - 1.3.4)
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-1.3',
  title: 'MARL Application Examples',
  sections: [
    {
      id: 'marl-1.3.1',
      title: 'Multi-Robot Systems and Warehouse Management',
      content: `
Let's ground all of the MARL concepts we've discussed in real-world applications. We start with one of the most natural fits: **multi-robot warehouse management**.

Picture a large warehouse with many aisles of storage racks. Orders arrive continuously, each specifying items and quantities to pick from the racks and deliver to a workstation. Now imagine 100 mobile robots navigating those aisles. We want to use MARL to train these robots to collaborate optimally so that orders are fulfilled as quickly and efficiently as possible.

In this application, each robot is controlled by an independent agent -- so we have 100 agents. Each agent might observe its own location and heading within the warehouse, the items it is carrying, and its current order. It could also receive information about nearby agents: their locations, items, and orders. The **action space** includes physical movements (rotating, accelerating, braking) and task actions (picking items). Agents might even have communication actions -- sending messages to other robots about their travel plans.

The reward could be individual (an agent gets a positive reward when it completes an order) or collective (all agents receive a reward when *any* order is completed). The collective case is called **common reward** (or **shared reward**) and is an important special case in cooperative MARL. The choice between individual and shared rewards has a big impact on what strategies the agents learn and how difficult the credit assignment problem becomes.

Krnjaic et al. (2024) applied MARL algorithms to multi-robot warehouse tasks. A simple simulator for this domain is described in Section 11.3.4 of the textbook. This domain is a natural cooperative MARL problem: the robots share the goal of clearing orders, but they must avoid collisions and coordinate who handles which order without wasting effort.
`,
      reviewCardIds: ['rc-marl-1.3-1', 'rc-marl-1.3-2'],
      illustrations: ['warehouse-robots'],
    },
    {
      id: 'marl-1.3.2',
      title: 'Competitive Play in Board Games and Video Games',
      content: `
Some of the most spectacular MARL successes come from competitive **game AI**. MARL has been used to train agents that achieve superhuman play in board games, card games, and large-scale video games.

In these settings, each agent assumes the role of a player. The available actions depend on the game -- moving pieces, placing cards, controlling units, or shooting targets. Observations can range from full (seeing the entire board in chess) to partial (seeing only your own cards in poker, or a limited field of view on a game map).

In fully competitive two-player games, rewards are **zero-sum**: one agent's reward is the negative of the other's. Win +1, lose -1, draw 0. This structure means an agent improves by exploiting the opponent's weaknesses. During MARL training, agents learn to patch their own vulnerabilities while probing for the opponent's mistakes, leading to a continuous arms race that produces strong competitive play.

The hall of fame of MARL game achievements is impressive. Tesauro's TD-Gammon (1994) learned world-class Backgammon via self-play. Silver et al. (2018) developed AlphaZero, which mastered Chess, Shogi, and Go from scratch using self-play and Monte Carlo tree search. Vinyals et al. (2019) created AlphaStar, which defeated top professional StarCraft II players -- a real-time strategy game with imperfect information, enormous action spaces, and long time horizons. Bard et al. (2020) built Pluribus, a poker AI that beat elite human players in six-player no-limit Texas Hold'em. And the Diplomacy team at Meta (2022) tackled a game that requires both strategic reasoning *and* natural language negotiation.

These game AI successes are not just academic milestones. They push the boundaries of MARL algorithms in ways that transfer to other domains -- particularly the ideas around self-play, population-based training, and handling partial observability under competitive pressure.
`,
      reviewCardIds: ['rc-marl-1.3-3', 'rc-marl-1.3-4'],
      illustrations: ['game-ai-timeline'],
    },
    {
      id: 'marl-1.3.3',
      title: 'Autonomous Driving and Electronic Markets',
      content: `
Not all multi-agent problems are purely cooperative or purely competitive. Two important domains -- **autonomous driving** and **electronic market trading** -- illustrate the **mixed-motive** (general-sum) setting, where agents must balance self-interest with the need to cooperate.

In autonomous driving, every vehicle on the road is an agent. MARL can train control policies for multiple vehicles navigating complex scenarios: busy intersections, roundabouts, highway merges. Actions might be continuous (steering angle, acceleration) or discrete (change lane, turn, overtake). Each agent observes its own vehicle state (position, speed, orientation) and information about nearby vehicles -- possibly noisy due to sensor limitations, possibly incomplete due to occlusions (other cars blocking the view).

The reward structure reflects multiple competing objectives. Collisions produce large negative rewards. Minimizing driving time yields positive rewards. Abrupt braking and frequent lane changes are penalized. This makes autonomous driving a **general-sum** problem: agents cooperate to avoid collisions but compete for road space and travel efficiency. General-sum reward is among the most challenging structures in MARL because there is no single measure of "optimal" that all agents agree on.

**Automated trading in electronic markets** is another general-sum domain. Software agents act as traders, placing buy and sell orders to maximize their own returns. Actions include buying or selling commodities at specified times, prices, and quantities. Agents observe price developments, key performance indicators, and possibly the order book. External information -- news about companies, energy demand patterns -- may also inform decisions. Rewards are defined by gains and losses over a trading period.

Trading is general-sum because agents must cooperate implicitly (agreeing on prices to complete transactions) while competing to maximize individual profit. MARL algorithms have been proposed for financial markets (Roesch et al. 2020) and energy markets (Qiu et al. 2021). These domains are challenging due to the sheer number of interacting agents, the non-stationarity of the market (everyone is adapting), and the difficulty of extracting meaningful reward signals from noisy financial data.
`,
      reviewCardIds: ['rc-marl-1.3-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Multi-robot warehouse management is a natural cooperative MARL application, where robots coordinate to fulfill orders quickly; reward can be individual or shared (common reward).
- Game AI is the showpiece of competitive MARL: AlphaZero (board games), AlphaStar (StarCraft II), and Pluribus (poker) demonstrate superhuman play via self-play training.
- Autonomous driving is a mixed-motive (general-sum) problem: vehicles cooperate to avoid collisions but compete for road space and travel time.
- Electronic market trading is another general-sum domain where agents must implicitly cooperate on prices while competing for profit.
- Each application highlights different MARL dimensions: reward structure (cooperative, zero-sum, general-sum), observability (full vs. partial), and action type (discrete vs. continuous).`,
};

export default lesson;
