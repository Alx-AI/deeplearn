/**
 * Lesson 8.10: Population-Based Training: PSRO and AlphaStar
 *
 * Covers: Double Oracle and PSRO, AlphaStar architecture, league training
 * Source sections: 9.9, 9.10
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-8.10',
  title: 'Population-Based Training: PSRO and AlphaStar',
  sections: [
    {
      id: 'marl-8.10.1',
      title: 'The Double Oracle Framework and PSRO',
      content: `
Self-play works beautifully for symmetric zero-sum games. But what about general-sum games, or games where agents have different roles? **Population-based training** generalizes self-play by maintaining *populations* of policies for each agent and evolving these populations over multiple generations.

**Policy Space Response Oracles (PSRO)** (Lanctot et al. 2017), based on the **double oracle algorithm**, is the foundational framework. The core loop has three steps:

**Step 1 -- Construct a meta-game.** In generation k, PSRO builds a normal-form game M^k where each agent's "actions" are the policies in its population Pi_i^k. The payoff for each combination of policies is estimated by running episodes of the underlying game G and averaging returns.

**Step 2 -- Solve the meta-game.** A **meta-solver** computes probability distributions delta_i^k over each population. For example, if the meta-solver computes a Nash equilibrium, delta_i^k tells us the equilibrium mixing probabilities over agent i's existing policies. This prevents overfitting to any single opponent.

**Step 3 -- Grow populations via oracle.** For each agent i, train a new **best-response policy** pi'_i against the distribution delta_{-i}^k over other agents' populations. This uses single-agent RL in game G, where opponent policies are sampled from delta_{-i}^k each episode. Add pi'_i to agent i's population: Pi_i^{k+1} = Pi_i^k union {pi'_i}.

PSRO repeats these steps, growing the populations and constructing increasingly large meta-games. It terminates when the oracle cannot find a new policy that improves on what is already in the population -- i.e., the best response is already present.

The convergence guarantee is clean: if PSRO uses exact Nash equilibrium as the meta-solver and exact best-responses as the oracle, the distributions delta_i^k converge to a Nash equilibrium of the underlying game G. In practice, both are approximated (RL gives approximate best-responses, and meta-games are estimated from finite samples), but PSRO still produces strong policies.
`,
      reviewCardIds: ['rc-marl-8.10-1', 'rc-marl-8.10-2'],
      illustrations: [],
    },
    {
      id: 'marl-8.10.2',
      title: 'AlphaStar: Architecture and Training',
      content: `
**AlphaStar** (Vinyals et al. 2019) is the algorithm that reached Grandmaster level in the full game of StarCraft II -- a real-time strategy game with enormous complexity. Two players collect resources, build armies of diverse units, and try to destroy each other, all under partial observability and with approximately 10^26 possible actions per step.

AlphaStar's policy pi(a_i^t | h_i^t, z ; theta_i) conditions on the observation history and a **strategy statistic** z extracted from human replay data. Observations include a minimap overview and lists of visible units with attributes. Actions specify a type (move, build, attack), a target unit, spatial coordinates, and a delay until the next action. The agent is constrained to human-realistic action rates (at most 22 non-duplicate actions per 5-second window).

The training pipeline has two phases:

**Phase 1 -- Supervised learning from human data.** Before any RL, policies are trained to imitate human actions from 971,000 recorded matches by top-22% ranked players. Strategy statistics z are extracted from each replay (build orders, unit compositions), and the policy learns to produce diverse strategies by conditioning on different z values. This phase alone achieves a ranking above 84% of human players.

**Phase 2 -- RL with population-based training.** After initialization, policies are trained using A2C-based RL against distributions of opponent agents (the PSRO oracle step). The policy receives reward +1 for winning and -1 for losing, with no discounting. A penalty discourages the action probabilities from deviating too far from the supervised policy, preventing catastrophic forgetting of the human-learned strategies.

The deep learning architecture processes the structured observations through specialized networks: a spatial encoder for the minimap, a transformer-style attention mechanism for unit lists, and an LSTM for maintaining history. The output is an auto-regressive action head that sequentially predicts action type, target, coordinates, and delay.

Without the human data initialization, AlphaStar's performance degrades dramatically -- the 10^26 action space is simply too large to explore from scratch with sparse terminal rewards.
`,
      reviewCardIds: ['rc-marl-8.10-3', 'rc-marl-8.10-4'],
      illustrations: [],
    },
    {
      id: 'marl-8.10.3',
      title: 'League Training and Results',
      content: `
The population-based training component of AlphaStar is called **League training**, a sophisticated variant of PSRO. Instead of simple best-response oracles, AlphaStar maintains a single league Pi^k containing three types of agents for each of the three StarCraft II races:

**Main agents** (one per race) are the policies we ultimately care about. They train against a mixture of opponents: 35% self-play (playing against their current policy), 50% against all past policies in the league using **Prioritized Fictitious Self-Play (PFSP)**, and 15% against past main exploiter policies. Their current parameters are frozen and added to the league every 2 billion training steps. Main agents are never reset.

**Main exploiter agents** (one per race) specifically target weaknesses in the main agents. They train 50% against main agents via PFSP and 50% against the currently learning main agents. When a main exploiter beats all three main agents 70%+ of the time (or after 4 billion steps), its parameters are added to the league and reset to the supervised initialization.

**League exploiter agents** (two per race) find strategies that no policy in the entire league handles well. They train against all league policies via PFSP and are added when they beat 70% of the league (or after 2 billion steps), with a 25% chance of resetting.

PFSP computes a distribution over opponents weighted by difficulty: delta_i^k(pi) proportional to f(Pr[pi'_i beats pi]). The default weighting f_hard(x) = (1-x)^p focuses on the hardest opponents; f_var(x) = x(1-x) focuses on opponents of similar skill.

This three-agent-type design creates a robust training ecosystem. Main agents develop strong general strategies. Main exploiters find and expose weaknesses, forcing main agents to adapt. League exploiters prevent the entire population from developing shared blind spots.

After 44 days of training on 32 TPUs, AlphaStar's main agents achieved **Grandmaster level** for all three races, placing above 99.8% of officially ranked human players. The algorithm uses the same deep RL and population-based training methodology throughout -- no game-specific heuristics beyond observation and action representations. Together with AlphaZero, AlphaStar demonstrates that combining deep learning, RL, and population-based training can produce superhuman performance in extraordinarily complex multi-agent environments.
`,
      reviewCardIds: ['rc-marl-8.10-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Population-based training generalizes self-play to general-sum games by maintaining policy populations for each agent and evolving them over generations.
- PSRO constructs meta-games from current populations, solves them for equilibrium distributions, trains best-response policies against those distributions, and adds the new policies to the populations.
- PSRO with exact Nash equilibrium meta-solver and exact best-responses converges to a Nash equilibrium of the underlying game.
- AlphaStar trains StarCraft II policies initialized from human data, then refined via A2C-based RL with league training (a PSRO variant).
- League training uses three agent types: main agents (develop strong play), main exploiters (find weaknesses), and league exploiters (prevent shared blind spots).
- PFSP weights opponents by difficulty to create effective training distributions.
- AlphaStar reached Grandmaster level (above 99.8% of human players) for all three StarCraft II races after 44 days of training on 32 TPUs.`,
};

export default lesson;
