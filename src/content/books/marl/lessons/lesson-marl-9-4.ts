/**
 * Lesson 9.4: Multi-Agent Environments Survey
 *
 * Covers: Cooperative environments (SMAC, LBF, Hanabi), competitive/mixed
 * environments (MPE, poker), choosing the right environment
 * Source sections: 11.3, 11.4
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-9.4',
  title: 'Multi-Agent Environments Survey',
  sections: [
    {
      id: 'marl-9.4.1',
      title: 'Cooperative Environments: SMAC, LBF, and Hanabi',
      content: `
Cooperative environments are the bread and butter of MARL benchmarking, and three stand out for the distinct challenges they pose: **SMAC**, **LBF**, and **Hanabi**.

**Level-Based Foraging (LBF)** places n agents in a grid-world where they must collect items. Each agent and item has a numerical **skill level**. An item can only be collected when a group of adjacent agents simultaneously chooses the "collect" action and their combined levels meet or exceed the item's level. LBF supports both full and partial observability, discrete observations and actions, and **sparse rewards** (agents only get rewarded on successful collection). The reward formula normalizes by item level and agent contribution, creating interesting mixed incentives: agents compete for easy solo items but must cooperate for high-level items. **Forced cooperation** variants set item levels so high that *all* agents must participate, creating hard exploration problems.

The **StarCraft Multi-Agent Challenge (SMAC)** puts a team of agents in combat scenarios from StarCraft II. Each agent controls one unit fighting a team controlled by built-in AI. SMAC is **partially observable** (agents see only nearby units within a radius) and uses **dense common rewards** based on damage dealt and enemies defeated, plus a bonus for winning. The central challenge is **credit assignment**: the common reward makes it hard to determine which agent's actions contributed to success. This is why value decomposition methods (VDN, QMIX) excel on SMAC. The newer **SMACv2** randomizes unit types and starting positions across episodes to prevent overfitting.

**Hanabi** is a cooperative turn-based card game where the twist is that agents can see *everyone else's* cards but **not their own**. With limited hint tokens for communication, agents must develop **implicit conventions** to convey information through the pattern of their actions. Hanabi is partially observable by design and has sparse rewards (score 0-25 based on successfully placed cards). It is a premier benchmark for testing communication, theory of mind, and ad hoc teamwork -- situations where agents must coordinate without pre-established protocols.
`,
      reviewCardIds: ['rc-marl-9.4-1', 'rc-marl-9.4-2'],
      illustrations: [],
      codeExamples: [
        {
          title: 'Setting up LBF with forced cooperation',
          language: 'python',
          code: `import lbforaging
import gym

# Standard LBF: 8x8 grid, 2 players, 1 food item
env = gym.make("Foraging-8x8-2p-1f-v2")

# Forced cooperation variant: item levels require all agents
env_coop = gym.make("Foraging-8x8-2p-1f-coop-v2")

# Partial observability variant: agents see limited radius
env_partial = gym.make("Foraging-8x8-2p-1f-v2", sight=2)

obs = env_coop.reset()
print(f"Agents: {len(obs)}, Obs dim: {obs[0].shape}")
# Agents: 2, Obs dim: (15,)`,
        },
        {
          title: 'Using SMAC via the PettingZoo interface',
          language: 'python',
          code: `# SMAC example (using smacv2 with PettingZoo wrapper)
from smacv2.env import StarCraft2Env

env = StarCraft2Env(map_name="3m")  # 3 marines vs 3 marines
env_info = env.get_env_info()

print(f"Agents: {env_info['n_agents']}")
print(f"Obs shape: {env_info['obs_shape']}")
print(f"Actions: {env_info['n_actions']}")

obs, state = env.reset()
# obs: list of per-agent observations
# state: global state (for centralised critic)`,
        },
      ],
    },
    {
      id: 'marl-9.4.2',
      title: 'Competitive and Mixed Environments: MPE, Poker, and Beyond',
      content: `
While cooperative environments dominate MARL research, **competitive** and **mixed-motive** environments test fundamentally different capabilities -- equilibrium finding, opponent modelling, and navigating conflicting incentives.

The **Multi-Agent Particle Environment (MPE)** is a collection of 2D navigation tasks with continuous observations and discrete or continuous actions. MPE includes tasks across the full cooperative-competitive spectrum. **Predator-prey** pits a team of slower predators against a faster prey agent -- a mixed game where predators cooperate while competing against the prey. **Cooperative navigation** requires agents to spread out and cover landmarks without collisions (fully cooperative, common reward). **Speaker-listener** tests emergent communication: a speaker agent that can see a target landmark must communicate its identity to a listener agent through discrete messages. MPE's dense rewards and relatively simple dynamics make it an excellent starting point for testing new algorithms, though reward magnitudes can span orders of magnitude, making standardization important.

For competitive games, **OpenSpiel** provides a vast collection including poker, chess, Go, backgammon, and more. OpenSpiel focuses on **turn-based** (extensive-form) games and provides both environments and algorithm implementations (including MCTS, CFR, and various RL methods). Poker variants are particularly important for MARL because they involve **imperfect information** -- agents must reason about hidden cards and opponents' beliefs. The Hanabi environment (Section 11.3.6) is also available through OpenSpiel.

**Melting Pot** pushes MARL toward generalization by providing 50+ diverse tasks and evaluating agents against **unseen co-players**. During training, a focal population learns in a task. During evaluation, some agents are replaced by pre-trained "background" policies with diverse behaviors. This tests whether agents can **zero-shot generalize** to new teammate or opponent behaviors -- a critical capability for real-world deployment where agents encounter previously unseen partners.

The **VMAS** (Vectorized Multi-Agent Simulator) extends MPE with GPU-accelerated physics and additional tasks, offering a significant speedup for environments that can be batched on GPU hardware.
`,
      reviewCardIds: ['rc-marl-9.4-3', 'rc-marl-9.4-4'],
      illustrations: [],
      codeExamples: [
        {
          title: 'MPE cooperative navigation with PettingZoo',
          language: 'python',
          code: `from pettingzoo.mpe import simple_spread_v3

# Cooperative navigation: 3 agents cover 3 landmarks
env = simple_spread_v3.parallel_env(N=3, max_cycles=25)
observations, infos = env.reset()

for step in range(25):
    actions = {
        agent: env.action_space(agent).sample()
        for agent in env.agents
    }
    observations, rewards, terminations, truncations, infos = env.step(actions)
    # rewards are dense: based on distance to landmarks + collision penalties
    total_reward = sum(rewards.values())
    if all(terminations.values()):
        break`,
        },
        {
          title: 'OpenSpiel poker environment',
          language: 'python',
          code: `import pyspiel

# Kuhn Poker: simple 3-card poker, great for testing
game = pyspiel.load_game("kuhn_poker")
state = game.new_initial_state()

while not state.is_terminal():
    if state.is_chance_node():
        # Deal cards randomly
        action = state.chance_outcomes()[0][0]
    else:
        legal_actions = state.legal_actions()
        action = legal_actions[0]  # Replace with learned policy
    state.apply_action(action)

returns = state.returns()  # [player_0_return, player_1_return]
print(f"Returns: {returns}")  # Zero-sum: sum is 0`,
        },
      ],
    },
    {
      id: 'marl-9.4.3',
      title: 'Choosing the Right Environment',
      content: `
With dozens of MARL environments available, selecting the right one for your research question or algorithm development is a critical decision. Here is a practical framework based on Chapter 11's criteria.

**Start with what you want to test.** If you are testing **convergence to solution concepts**, use matrix games (Section 11.2) -- they have computable ground-truth solutions. If you are testing **credit assignment** in common-reward settings, use SMAC or LBF with forced cooperation. If you are testing **communication emergence**, use MPE speaker-listener or Hanabi. If you are testing **scalability in number of agents**, use RWARE (multi-robot warehouse, which supports varying team sizes) or LBF with many agents.

**Consider the complexity dimensions.** Environments vary along several axes that interact:
- **State/action complexity**: LBF and RWARE have discrete, compact spaces. MPE and GRF have continuous, high-dimensional spaces. SMAC is mixed.
- **Observability**: LBF and MPE offer both full and partial options. SMAC, RWARE, and Hanabi are always partially observable.
- **Reward density**: MPE and SMAC provide dense rewards. LBF, RWARE, Hanabi, and Overcooked have sparse rewards that demand effective exploration.
- **Cooperative vs. competitive**: SMAC, LBF, Hanabi, and Overcooked are cooperative. MPE spans the spectrum. OpenSpiel focuses on competitive turn-based games.

**Use environment collections for breadth.** PettingZoo unifies many environments behind a single interface, making it easy to test an algorithm across diverse settings. Melting Pot focuses on generalization across co-players. OpenSpiel covers turn-based competitive games.

**Practical advice from experience.** Start simple: verify your algorithm on matrix games, then move to LBF or MPE (fast, well-understood), and only then scale to SMAC or GRF (compute-intensive). Always run multiple seeds -- MARL results are notoriously high-variance. And document your **exact environment version and parameters**: SMAC results depend on the StarCraft II patch version, and LBF results depend on the grid size, number of agents, and cooperation mode. Reproducibility in MARL requires this level of specificity.
`,
      reviewCardIds: ['rc-marl-9.4-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- LBF tests cooperation with mixed incentives and sparse rewards; SMAC tests credit assignment with common rewards; Hanabi tests communication under partial observability.
- MPE offers diverse tasks across the cooperative-competitive spectrum with dense rewards and continuous observations; OpenSpiel covers turn-based competitive games like poker and chess.
- Melting Pot evaluates generalization to unseen co-players, a critical capability for real-world deployment.
- Choose environments based on what you want to test: matrix games for convergence, SMAC for credit assignment, Hanabi for communication, MPE for quick iteration.
- Always start simple (matrix games, then LBF/MPE) before scaling to compute-intensive environments; run multiple seeds; document exact environment versions and parameters for reproducibility.`,
};

export default lesson;
