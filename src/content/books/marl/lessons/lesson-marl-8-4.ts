/**
 * Lesson 8.4: Counterfactual Baselines and Equilibrium Selection
 *
 * Covers: COMA and counterfactual baselines, credit assignment via counterfactuals,
 *         equilibrium selection
 * Source sections: 9.4.4, 9.4.5
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-8.4',
  title: 'Counterfactual Baselines and Equilibrium Selection',
  sections: [
    {
      id: 'marl-8.4.1',
      title: 'COMA and Counterfactual Baselines',
      content: `
When all agents share a common reward, a natural question arises: "What was agent $i$'s specific contribution?" This is the **multi-agent credit assignment problem**. Centralized action-value critics give us a powerful tool to address it through **counterfactual reasoning**.

The idea builds on **difference rewards** (Wolpert and Tumer 2002): compare the reward the team actually received with the reward it *would have* received if agent $i$ had taken a different action, while all other agents' actions stayed the same:

$$d_i = R(s, \\langle a_i, a_{-i} \\rangle) - R(s, \\langle \\tilde{a}_i, a_{-i} \\rangle)$$

This "counterfactual" tells agent $i$ how much its specific action mattered. But computing it requires (1) choosing a default action $\\tilde{a}_i$ and (2) access to the reward function. The **aristocrat utility** avoids choosing a specific default by averaging over agent $i$'s current policy:

$$d_i = R(s, \\langle a_i, a_{-i} \\rangle) - \\mathbb{E}_{a'_i \\sim \\pi_i}\\left[ R(s, \\langle a'_i, a_{-i} \\rangle) \\right]$$

This measures whether agent $i$'s actual action was better or worse than what it would typically do.

**COMA** (Counterfactual Multi-Agent Policy Gradients, Foerster et al. 2018) applies this idea using a centralized action-value critic. Instead of using $V(h_i, z)$ as a baseline, COMA defines a **counterfactual baseline** that marginalizes over agent $i$'s actions:

$$\\text{Adv}_i(h_i, z, a) = Q(h_i, z, a \\;; \\theta) - \\sum_{a'_i \\in A_i} \\pi(a'_i \\mid h_i \\;; \\phi_i) \\cdot Q(h_i, z, \\langle a'_i, a_{-i} \\rangle \\;; \\theta)$$

The second term is the counterfactual baseline: the expected centralized value if agent $i$ followed its own policy while other agents' actions $a_{-i}$ stayed fixed. This can be computed efficiently using the centralized action-value critic architecture that outputs values for all of agent $i$'s actions simultaneously.

Despite its elegant motivation, COMA suffers in practice from **high variance** in its baseline estimates and inconsistent value estimates, which can lead to unstable training and poor performance.
`,
      reviewCardIds: ['rc-marl-8.4-1', 'rc-marl-8.4-2'],
      illustrations: [],
    },
    {
      id: 'marl-8.4.2',
      title: 'Credit Assignment via Counterfactuals',
      content: `
Let us build more intuition for why counterfactual credit assignment matters and how it works in practice.

Consider three robots cleaning a warehouse. They share a common reward: +1 whenever any mess is cleaned. After observing a +1 reward, which robot deserves credit? With a standard advantage baseline $V(h_i)$, every robot gets a positive advantage signal, even those that contributed nothing. The robots that were just wandering aimlessly get reinforced for doing nothing useful.

A counterfactual baseline asks a more targeted question for each robot: "If *you specifically* had done something different, would the team still have gotten that reward?" If robot A was the one that cleaned the mess, the answer is no -- replacing its action with a random one would likely lose the reward. So robot A gets a large positive advantage. But robot B, which was in a different room, gets a near-zero advantage: replacing its action changes nothing about the received reward.

The key mathematical insight is that the counterfactual baseline does *not* change the expected policy gradient -- it is a valid baseline in the policy gradient theorem sense. Subtracting any function that does not depend on agent $i$'s action from the Q-value preserves the gradient in expectation. The counterfactual baseline goes further: it subtracts a function that depends on other agents' *actual* actions $a_{-i}$, which is valid because $a_{-i}$ is independent of agent $i$'s action choice given the current information state.

Castellini et al. (2021) extended these ideas to work directly with the REINFORCE algorithm. When the reward function is available, they compute return estimates over aristocrat-utility-based difference rewards. When the reward function is not available (the more common case), they propose learning a model of the reward function from experience and using that model to estimate counterfactual rewards.

The practical limitation of counterfactual baselines is that they require the centralized action-value critic to produce accurate value estimates for all possible actions of agent i while holding other agents' actions fixed. Errors in these estimates propagate into noisy advantage signals, which can destabilize training.
`,
      reviewCardIds: ['rc-marl-8.4-3', 'rc-marl-8.4-4'],
      illustrations: [],
    },
    {
      id: 'marl-8.4.3',
      title: 'Equilibrium Selection with Centralized Action-Value Critics',
      content: `
Centralized action-value critics are not just useful for credit assignment -- they can also guide agents toward *better* equilibria.

Many multi-agent problems have multiple Nash equilibria with different payoffs. Consider the **Stag Hunt**: both agents choosing A yields $(4,4)$, both choosing B yields $(2,2)$. Both outcomes are Nash equilibria, but $(A,A)$ is Pareto-optimal while $(B,B)$ is "safe." The problem is that learning agents tend to converge to the safe equilibrium. If agents start with uniform random policies, the expected reward for choosing A is $0.5 \\times 4 + 0.5 \\times 0 = 2.0$, while for B it is $0.5 \\times 3 + 0.5 \\times 2 = 2.5$. So the gradient pushes agents toward B, creating a positive feedback loop that reinforces the suboptimal equilibrium.

**Pareto Actor-Critic (Pareto-AC)** (Christianos et al. 2023) addresses this in **no-conflict games** -- games where all agents agree on the most-preferred outcome. The key idea: when training agent $i$, assume all other agents will play the actions that *maximize agent $i$'s returns*:

$$\\pi_{-i}^+ \\in \\arg\\max_{\\pi_{-i}} U_i(\\pi_i, \\pi_{-i})$$

In a no-conflict game, this is also the outcome every agent prefers. Using this optimistic assumption, the policy objective becomes:

$$L(\\phi_i) = -\\mathbb{E}\\left[ \\log \\pi(a_i \\mid h_i \\;; \\phi_i) \\cdot \\left( Q^{\\pi^+}(h_i, z, \\langle a_i, a_{-i} \\rangle \\;; \\theta_q) - V^{\\pi^+}(h_i, z \\;; \\theta_v) \\right) \\right]$$

where $a_{-i}$ is drawn from $\\pi_{-i}^+$ and the advantage is computed accordingly. During training, $\\pi_{-i}^+$ is computed by maximizing over other agents' actions in the joint-action value function.

Experiments in the **Climbing game** and level-based foraging with cooperation penalties demonstrate the effect. Centralized A2C converges to the safe, suboptimal equilibrium (avoiding penalties), while Pareto-AC learns to coordinate on the Pareto-optimal outcome. The optimistic assumption encoded in the centralized action-value critic breaks the risk-aversion feedback loop that traps standard algorithms.

The limitation is scalability: computing argmax over other agents' joint actions requires iterating over an exponentially large space, which currently limits Pareto-AC to settings with few agents or small action spaces.
`,
      reviewCardIds: ['rc-marl-8.4-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- COMA uses a counterfactual baseline that marginalizes over agent $i$'s actions while holding other agents' actions fixed, directly addressing multi-agent credit assignment.
- Difference rewards and the aristocrat utility provide the theoretical foundation: "how much better was agent $i$'s action compared to what its policy would typically do?"
- Counterfactual baselines do not change the expected policy gradient but can reduce variance by isolating each agent's contribution to shared rewards.
- Pareto-AC uses centralized action-value critics to guide agents toward Pareto-optimal equilibria in no-conflict games by optimistically assuming other agents will cooperate.
- Standard learning agents tend to converge to safe, suboptimal equilibria; Pareto-AC breaks this pattern by modifying the advantage computation.
- Scalability remains a challenge: both counterfactual baselines and equilibrium selection require reasoning over other agents' action spaces.`,
};

export default lesson;
