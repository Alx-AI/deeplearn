/**
 * Lesson 4.1: Joint Policies and Expected Returns
 *
 * Covers: Joint policies, joint action profiles, expected returns and mixed strategies
 * Source sections: 4.1
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-4.1',
  title: 'Joint Policies and Expected Returns',
  sections: [
    {
      id: 'marl-4.1.1',
      title: 'Joint Policies as Solutions to Games',
      content: `What does it mean for agents to interact "optimally" in a multi-agent system? This is the central question of game theory, and to answer it we need the concept of a **solution concept**. A MARL problem is defined by combining a game model (e.g., normal-form game, stochastic game, POSG) with a solution concept (e.g., Nash equilibrium, social welfare). Together they specify both the rules of the interaction and the properties we want the agents' behavior to satisfy.

A **solution** to a game is a **joint policy** -- a tuple of individual policies, one per agent: $\\pi = (\\pi_1, \\ldots, \\pi_n)$. A solution concept then defines the requirements this joint policy must satisfy, typically expressed in terms of expected returns. For common-reward games where all agents share the same reward signal, the definition is straightforward: maximize the expected return received by every agent. But when agents have differing rewards, things get much more nuanced, and we need a richer vocabulary of solution concepts.

Before diving into specific solution concepts, we need a universal definition of expected return that works across all game models from Chapter 3 -- normal-form games, stochastic games, and POSGs. Why universal? Because we want our solution concepts to apply to any game model without needing separate definitions each time. This chapter builds a hierarchy of increasingly general equilibrium concepts, starting from minimax and building up to Nash equilibrium and correlated equilibrium, along with refinements like Pareto optimality and alternative notions like no-regret. All of these depend on how we define expected returns under a joint policy.

An important technical note: all definitions in this chapter assume **finite** game models -- finite state, action, and observation spaces, and a finite number of agents. Games with infinite elements (like continuous actions) can use analogous definitions with densities and integrals, but may have different existence properties for solutions.`,
      reviewCardIds: ['rc-marl-4.1-1', 'rc-marl-4.1-2'],
      illustrations: [],
    },
    {
      id: 'marl-4.1.2',
      title: 'Joint Actions and History-Based Expected Returns',
      content: `To define expected returns universally, we work in the most general game model: the POSG. Since stochastic games and normal-form games are special cases of POSGs, any definition we give here automatically applies to them too.

We need some notation. A **full history** up to time $t$ is the tuple $\\hat{h}_t = \\{(s_\\tau, o_\\tau, a_\\tau) \\text{ for } \\tau = 0 \\text{ to } t-1,\\; s_t, o_t\\}$, containing all states, joint observations, and joint actions before time $t$, plus the current state $s_t$ and joint observation $o_t$. The function $\\sigma$ extracts the joint-observation history from a full history.

We define the probability of a joint observation as $O(o_t \\mid a_{t-1}, s_t) = \\prod_i O_i(o_{t,i} \\mid a_{t-1}, s_t)$. The **joint action probability** under a joint policy $\\pi$ is $\\pi(a_\\tau \\mid h_\\tau)$. If agents act independently -- the standard assumption for Nash equilibrium -- this factors as $\\pi(a_\\tau \\mid h_\\tau) = \\prod_j \\pi_j(a_{\\tau,j} \\mid h_{\\tau,j})$. However, in settings like correlated equilibrium, agents may not act independently, and $\\pi(a_\\tau \\mid h_\\tau)$ can be defined accordingly.

The **history-based expected return** for agent $i$ under joint policy $\\pi$ sums the discounted return for each possible full history, weighted by its probability:

$$U_i(\\pi) = \\sum_{\\hat{h}_t} \\Pr(\\hat{h}_t \\mid \\pi) \\cdot u_i(\\hat{h}_t)$$

where $u_i(\\hat{h}_t) = \\sum_{\\tau=0}^{t-1} \\gamma^\\tau R_i(s_\\tau, a_\\tau, s_{\\tau+1})$ is the discounted return for agent $i$, with discount factor $\\gamma \\in [0, 1]$. The history probability $\\Pr(\\hat{h}_t \\mid \\pi)$ is the product of the initial state distribution, observation probabilities, policy action probabilities, and transition probabilities along the history. For non-repeated normal-form games, the expected return reduces simply to the expected reward in a single step.`,
      reviewCardIds: ['rc-marl-4.1-3'],
      illustrations: [],
    },
    {
      id: 'marl-4.1.3',
      title: 'Recursive Expected Returns and Mixed Strategies',
      content: `There is a second, equivalent way to define expected returns that will be more useful for computation. Analogous to the Bellman equations in single-agent RL, we define two interlocking functions:

$V^\\pi_i(\\hat{h})$ is the expected return (value) for agent $i$ when agents follow joint policy $\\pi$ after full history $\\hat{h}$:

$$V^\\pi_i(\\hat{h}) = \\sum_a \\pi(a \\mid \\sigma(\\hat{h})) \\cdot Q^\\pi_i(\\hat{h}, a)$$

$Q^\\pi_i(\\hat{h}, a)$ is the expected return for agent $i$ when agents execute joint action $a$ after $\\hat{h}$ and then follow $\\pi$ subsequently:

$$Q^\\pi_i(\\hat{h}, a) = \\sum_{s'} T(s' \\mid s(\\hat{h}), a) \\left[ R_i(s(\\hat{h}), a, s') + \\gamma \\sum_{o'} O(o' \\mid a, s') V^\\pi_i(\\langle \\hat{h}, a, s', o' \\rangle) \\right]$$

The overall expected return is then $U_i(\\pi) = \\mathbb{E}[V^\\pi_i(\\langle s_0, o_0 \\rangle)]$ where $s_0$ is drawn from the initial state distribution. These two definitions -- history-based and recursive -- are equivalent. You can think of the history-based version as enumerating all possible trajectories, while the recursive version constructs an infinite tree rooted at the initial state. The recursive form is particularly useful because it can be turned into algorithms like value iteration for games.

An important distinction in this context is between **deterministic** (pure) and **probabilistic** (mixed) policies. A deterministic policy assigns probability 1 to a single action; a probabilistic policy randomizes over multiple actions. Some games have solutions only when agents are allowed to use probabilistic policies -- Rock-Paper-Scissors is a classic example where the only equilibrium involves each agent randomizing uniformly. This distinction matters practically because some MARL algorithms can only represent deterministic policies and therefore cannot learn certain equilibria.

With $U_i(\\pi)$ now well-defined for any game model, we have the foundation to define all the solution concepts that follow.`,
      reviewCardIds: ['rc-marl-4.1-4', 'rc-marl-4.1-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- A MARL problem = game model + solution concept. A solution is a **joint policy** (one policy per agent) satisfying conditions defined in terms of expected returns.
- Expected return $U_i(\\pi)$ can be defined via two equivalent formulations: **history-based** (enumerating all trajectories) and **recursive** (Bellman-style $V$ and $Q$ functions).
- Joint action probabilities factor into independent agent policies under Nash equilibrium, but can be correlated under other solution concepts.
- The distinction between **deterministic** (pure) and **probabilistic** (mixed) policies is critical -- some games only have solutions involving randomization.
- All definitions assume finite game models; continuous extensions exist but may have different existence guarantees.`,
};

export default lesson;
