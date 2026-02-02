/**
 * Lesson 5.6: Self-Play and Mixed-Play
 *
 * Covers: Self-play definition and benefits, cyclic strategies limitation,
 * mixed-play and population-based alternatives
 * Source sections: 5.5.1, 5.5.2
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-5.6',
  title: 'Self-Play and Mixed-Play',
  sections: [
    {
      id: 'marl-5.6.1',
      title: 'Self-Play: Definition and Benefits',
      content: `
Once we adopt independent learning -- where each agent runs its own learning algorithm -- a natural question arises: should all agents use the *same* algorithm, or can they use different ones? This distinction gives rise to two fundamental modes of operation in MARL: **self-play** and **mixed-play**.

The term "self-play" actually has **two related but distinct definitions** in the literature, and the textbook carefully distinguishes them:

**Algorithm self-play** means that all agents use the same learning algorithm. Agent 1 might use IQL and Agent 2 also uses IQL, but they maintain separate Q-tables and learn separate policies. This is the standard assumption underlying almost all convergence results in MARL. The rationale is practical: if all agents follow the same learning rule, the dynamics are more predictable and theoretical analysis becomes tractable. The IQL convergence results we discussed earlier, the IGA algorithm, WoLF-PHC, fictitious play -- essentially all the MARL algorithms in the textbook -- assume algorithm self-play.

**Policy self-play** is a more literal interpretation: an agent's policy is trained directly *against itself*. There is a single policy pi that controls all agents simultaneously. One of the earliest successes of this approach was **TD-Gammon** (Tesauro, 1994), which achieved champion-level backgammon play by having a neural network play against copies of itself. More recently, policy self-play combined with deep RL produced landmark results: AlphaGo and AlphaZero (Silver et al., 2017, 2018) in Go and chess, and OpenAI Five (Berner et al., 2019) in Dota 2.

Note that policy self-play **implies** algorithm self-play (same policy means same algorithm), but not vice versa. A key benefit of policy self-play is **data efficiency**: since every agent generates experience for the same policy, all experience can be pooled to train a single set of parameters. However, policy self-play requires the agents to have **symmetrical roles** and **egocentric observations** -- the same policy must make sense from each agent's perspective. Algorithm self-play has no such restriction and can handle agents with different action spaces, observations, and rewards.
`,
      reviewCardIds: ['rc-marl-5.6-1', 'rc-marl-5.6-2'],
      illustrations: [],
    },
    {
      id: 'marl-5.6.2',
      title: 'Cyclic Strategies and Limitations of Self-Play',
      content: `
Self-play is powerful, but it has a well-known limitation: it can produce policies that are strong against *themselves* but weak against different strategies. This leads to **cyclic strategies** -- a phenomenon closely related to the non-stationarity and policy oscillation we discussed in lesson 5.4.

Consider a simplified example in Rock-Paper-Scissors. Suppose a self-play agent discovers that Rock beats Scissors and starts playing Rock frequently. In self-play, the opposing copy also plays Rock, so the agent sees a lot of (Rock, Rock) ties. It then discovers Paper beats Rock and shifts to Paper. The opponent mirrors this shift. The agent discovers Scissors beats Paper... and the cycle continues.

In a game with a unique Nash equilibrium like Rock-Paper-Scissors, self-play can still converge (as we saw with WoLF-PHC). But in more complex games, self-play can get trapped in cycles where the policy oscillates between strategies that each exploit the *previous* version of itself. Each new policy is a best response to the old policy, but not robust to further changes. This is sometimes called the **rock-paper-scissors problem** of self-play, and it appears even in sophisticated applications.

**Population-based training** extends self-play to address this limitation. Instead of training against a single copy of the current policy, agents train against a **distribution of policies** -- including past versions of themselves. By maintaining a population of diverse policies and sampling opponents from this population, agents are forced to be robust against a wider range of strategies rather than just the current one. This approach was used in several breakthrough results, including the work on StarCraft II (Vinyals et al., 2019) and capture-the-flag games (Jaderberg et al., 2019).

The textbook distinguishes policy self-play from population-based training as a spectrum: pure self-play is the simplest case (train against exactly yourself), and population-based training broadens the opponent distribution for greater robustness.
`,
      reviewCardIds: ['rc-marl-5.6-3', 'rc-marl-5.6-4'],
      illustrations: [],
    },
    {
      id: 'marl-5.6.3',
      title: 'Mixed-Play and Robustness to Unknown Opponents',
      content: `
**Mixed-play** is the opposite of self-play: the agents use *different* learning algorithms. This is not just a theoretical curiosity -- it models many real-world scenarios. In financial trading markets, different firms deploy different proprietary algorithms. In **ad hoc teamwork**, an agent must collaborate with previously unknown partners whose behaviors may be arbitrary.

The study by Albrecht and Ramamoorthy (2012) compared several MARL algorithms in mixed-play settings across many normal-form games, including Nash-Q, JAL-AM, WoLF-PHC, and regret matching. The conclusion was sobering: **no single algorithm consistently dominated**. Each had relative strengths and weaknesses depending on the game structure and the opponent's algorithm. This stands in contrast to self-play, where convergence results at least tell us what to expect when both sides use the same method.

Several research directions attempt to bridge the gap between self-play and mixed-play:

**Best-response convergence:** Some algorithms aim for a dual guarantee: converge to an equilibrium in algorithm self-play, but converge to a **best-response policy** if other agents use a stationary (non-learning) policy. This was proposed by Bowling and Veloso (2002) and further developed by Banerjee and Peng (2004) and Conitzer and Sandholm (2007).

**Targeted optimality and safety:** The framework of Powers and Shoham (2004) assumes that other agents belong to a particular class (e.g., agents using finite state automata or decision trees). The goal is to achieve best-response returns against that class, while guaranteeing at least **maximin returns** -- the safety floor that can be guaranteed against *any* opponent. In algorithm self-play, these algorithms aim for Pareto-optimal outcomes.

These approaches highlight a fundamental tension in MARL: optimizing for self-play can leave you vulnerable to unexpected opponents, while preparing for arbitrary opponents can sacrifice performance in cooperative or symmetric settings. The choice between self-play and mixed-play assumptions should be guided by the application: is the deployment environment controlled (all agents are yours) or open (agents from different sources interact)?
`,
      reviewCardIds: ['rc-marl-5.6-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Self-play has two definitions: algorithm self-play (all agents use the same learning algorithm) and policy self-play (a single policy is trained against itself). Policy self-play implies algorithm self-play.
- Policy self-play enables data-efficient training by pooling all agents' experience, but requires agents to have symmetrical roles and egocentric observations.
- Self-play can produce cyclic strategies that are strong against themselves but fragile against different opponents; population-based training mitigates this by training against a diverse distribution of policies.
- Mixed-play (agents using different algorithms) models real-world scenarios like trading markets and ad hoc teamwork, but no single algorithm dominates across all mixed-play settings.
- Research bridges self-play and mixed-play through dual guarantees: equilibrium convergence in self-play plus best-response or maximin guarantees against arbitrary opponents.`,
};

export default lesson;
