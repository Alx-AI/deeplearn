import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-2.3',
  title: 'Discounted Returns and Optimal Policies',
  sections: [
    {
      id: 'marl-2.3.1',
      title: 'Returns and Discounting',
      content: `
We have established that the goal of an RL agent is to maximize cumulative reward -- but we need to make this notion mathematically precise. The **return** is the quantity that formalizes "cumulative reward over time."

For a terminating episode of length T, the simplest definition is the **total return**: the sum of all rewards collected from time step 0 to T-1:

G = r_0 + r_1 + ... + r_{T-1}

Because MDPs are stochastic -- actions can lead to different outcomes -- the agent cannot guarantee a specific return in every episode. Instead, it maximizes the **expected return** E_pi[r_0 + r_1 + ... + r_{T-1}], where the expectation is taken over the initial state distribution mu, the policy pi, and the transition function T.

For non-terminating MDPs, however, the total return can diverge to infinity, making it useless for comparing policies. The standard solution is to introduce a **discount factor** gamma in [0, 1) that geometrically reduces the weight of future rewards. The **discounted return** is defined as:

G_t = r_t + gamma * r_{t+1} + gamma^2 * r_{t+2} + ... = sum_{k=0}^{infinity} gamma^k * r_{t+k}

The discount factor ensures this infinite sum is bounded. Specifically, if rewards lie in a finite range [r_min, r_max], the discounted return satisfies:

G_t <= r_max / (1 - gamma)

This upper bound comes from the closed-form of the geometric series sum_{k=0}^{infinity} gamma^k = 1 / (1 - gamma). So even in a never-ending interaction, the discounted return is always a finite, well-defined quantity.

One crucial notational point: the discounted return has a **recursive structure** that will be central to everything that follows. We can write G_t = r_t + gamma * G_{t+1}. This recursive decomposition is the seed from which Bellman equations grow, and it is the reason bootstrapping methods work.
`,
      reviewCardIds: ['rc-marl-2.3-1', 'rc-marl-2.3-2'],
      illustrations: [],
    },
    {
      id: 'marl-2.3.2',
      title: 'Why Discount?',
      content: `
The discount factor gamma is not just a mathematical trick to prevent infinite sums -- it carries meaningful interpretations and is an essential part of the problem specification.

**Interpretation 1: Termination probability.** One way to think about gamma is that (1 - gamma) represents the probability that the MDP terminates after each time step. Under this view, the probability that the process survives for exactly T steps is gamma^{T-1} * (1 - gamma). In the Mars Rover example, a discount factor of gamma = 0.95 models a 5% chance of battery failure at every step. This interpretation connects discounting to a concrete physical phenomenon.

**Interpretation 2: Temporal preference.** Alternatively, gamma can be viewed as how much the agent "cares" about distant versus near-term rewards. The weight assigned to reward r_t received at time t is gamma^t. A gamma close to 0 produces a **myopic** agent that focuses almost exclusively on immediate rewards. A gamma close to 1 yields a **farsighted** agent that gives nearly equal weight to rewards far into the future. Setting gamma = 0.99, for example, means a reward 100 steps away is still weighted at about 0.37 -- the agent cares substantially about the long run.

A critical point: **gamma is part of the learning objective, not a tunable hyperparameter of the algorithm.** Two RL problems that share the same MDP but differ in their discount factor may have different optimal policies. In the Mars Rover problem, gamma = 0.95 leads to an optimal policy that takes the safer, longer path (value V*(Start) = 4.1), while gamma = 0.5 leads to an optimal policy that risks the short path (value V*(Start) = 0). Both policies are optimal for their respective learning problems.

For the rest of this book, whenever we say "return" without further qualification, we mean the **discounted return** with some specified gamma. This convention keeps the mathematics clean and consistent across both episodic and continuing tasks.
`,
      reviewCardIds: ['rc-marl-2.3-3', 'rc-marl-2.3-4'],
      illustrations: [],
    },
    {
      id: 'marl-2.3.3',
      title: 'Optimal Policies',
      content: `
With the discounted return as our learning objective, we can now precisely define what it means for a policy to be optimal.

An **optimal policy** pi* is one whose expected discounted return is at least as large as that of every other policy, in every state:

V^{pi*}(s) >= V^{pi'}(s) for all policies pi' and all states s in S

This is a strong requirement -- we demand optimality simultaneously in every state, not just on average or from a single starting state. Remarkably, such a policy always exists in finite MDPs. This is a consequence of the Bellman equations, which we will study in the next lesson.

The **optimal value function** V*(s) is defined as the maximum expected return achievable from state s under any policy:

V*(s) = max_{pi'} V^{pi'}(s) for all s in S

Similarly, the **optimal action-value function** Q*(s, a) gives the maximum expected return when starting in state s, taking action a, and then following the best possible policy thereafter:

Q*(s, a) = max_{pi'} Q^{pi'}(s, a) for all s in S, a in A

Once Q* is known, extracting the optimal policy is trivial: in each state, simply pick the action with the highest Q*-value:

pi*(s) = argmax_{a in A} Q*(s, a)

If multiple actions share the same maximum value under Q*, the optimal policy can distribute probability among them in any way. This means the optimal value function is always unique, but there may be **multiple optimal policies** that achieve it. However, there always exists at least one **deterministic** optimal policy in a finite MDP -- you never need to randomize to be optimal.

This is the fundamental promise of RL: no matter how complex the environment, if we can compute or learn Q*, we immediately know how to act optimally. The challenge, of course, is that computing Q* in realistic problems is far from trivial. The next lessons will introduce two algorithm families -- dynamic programming and temporal-difference learning -- that approach this challenge from complementary angles.
`,
      reviewCardIds: ['rc-marl-2.3-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- The discounted return G_t = sum of gamma^k * r_{t+k} ensures finite, well-defined cumulative rewards even in infinite-horizon tasks.
- The recursive structure G_t = r_t + gamma * G_{t+1} is the foundation for Bellman equations and bootstrapping methods.
- The discount factor gamma is part of the problem specification, not a tunable hyperparameter; different gamma values can yield different optimal policies.
- An optimal policy pi* maximizes expected return simultaneously in every state; the optimal value function V* is always unique.
- Given Q*, the optimal policy is simply argmax over actions -- there always exists a deterministic optimal policy in finite MDPs.`,
};

export default lesson;
