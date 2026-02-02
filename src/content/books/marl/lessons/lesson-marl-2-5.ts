import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-2.5',
  title: 'Dynamic Programming: Policy and Value Iteration',
  sections: [
    {
      id: 'marl-2.5.1',
      title: 'Policy Evaluation',
      content: `
**Dynamic programming** (DP) is a family of algorithms that compute value functions and optimal policies by directly using the Bellman equations as iterative update operators. DP algorithms require **complete knowledge** of the MDP model -- the transition function T and reward function R must be fully specified. While this assumption is often unrealistic, DP provides the theoretical foundation on which model-free methods like temporal-difference learning are built.

The first DP building block is **policy evaluation**: computing the state-value function V^pi for a given policy pi. We already know that V^pi is the unique solution to a system of m linear equations (the Bellman expectation equations). We could solve this system with Gaussian elimination in O(m^3) time, but for large state spaces this is prohibitively expensive. Instead, we use **iterative policy evaluation**.

The algorithm initializes a value vector V_0(s) = 0 for all states and then repeatedly applies the Bellman equation as an update rule:

V_{k+1}(s) <- sum_{a in A} pi(a | s) * sum_{s' in S} T(s' | s, a) * [R(s, a, s') + gamma * V_k(s')]

Each pass through all states is called a **sweep**. After each sweep, the estimates V_k move closer to the true value function V^pi. The process is repeated until the values converge -- that is, until the maximum change across all states in a sweep drops below some small threshold.

Why does this converge? The Bellman operator is a **gamma-contraction mapping** under the max-norm. By the Banach fixed-point theorem, any contraction mapping has a unique fixed point, and repeated application of the mapping from any starting point converges to that fixed point. Since V^pi is the fixed point of the Bellman operator, iterative policy evaluation is guaranteed to converge to V^pi.

A key property of this update is **bootstrapping**: the value estimate for state s is updated using value estimates of other states s'. We are using our own (possibly inaccurate) estimates to improve themselves. Despite this seemingly circular logic, the contraction property guarantees convergence. Bootstrapping will reappear as a central concept in temporal-difference learning.
`,
      reviewCardIds: ['rc-marl-2.5-1', 'rc-marl-2.5-2'],
      illustrations: [],
    },
    {
      id: 'marl-2.5.2',
      title: 'Policy Improvement and Policy Iteration',
      content: `
Policy evaluation tells us *how good* a policy is. The next step is **policy improvement**: making the policy *better*. Together, these two steps form the **policy iteration** algorithm.

Given the value function V^pi computed by policy evaluation, policy improvement constructs a new policy pi' by acting **greedily** with respect to V^pi in every state:

pi'(s) = argmax_{a in A} sum_{s' in S} T(s' | s, a) * [R(s, a, s') + gamma * V^pi(s')]

Equivalently, using the action-value notation: pi'(s) = argmax_{a in A} Q^pi(s, a). The new policy pi' selects the single best action in each state according to the current value estimates.

The **policy improvement theorem** guarantees that if the greedy policy pi' improves on pi in at least one state (and is no worse in any state), then pi' is a strictly better policy overall: V^{pi'}(s) >= V^pi(s) for all states s. This is a remarkable result -- local greedy improvements translate into global improvements in expected return.

**Policy iteration** alternates between policy evaluation and policy improvement:

pi_0 -> V^{pi_0} -> pi_1 -> V^{pi_1} -> pi_2 -> ... -> V* -> pi*

Starting from an arbitrary initial policy pi_0 (often uniform-random), each cycle evaluates the current policy to obtain V^pi, then improves the policy greedily to obtain pi'. If the greedy policy pi' is identical to pi -- meaning no improvement was possible -- then V^pi must satisfy the Bellman optimality equation, and we have found the optimal policy pi*.

In the Mars Rover example, running policy iteration converges to the optimal policy pi* that chooses "left" in the Start state and "right" in Site A and Site B, achieving V*(Start) = 4.1.

Because the number of deterministic policies in a finite MDP is finite (|A|^|S|), and each policy improvement step either produces a strictly better policy or terminates, policy iteration is guaranteed to converge in a finite number of iterations. In practice, convergence is typically very fast, often requiring far fewer iterations than the total number of possible policies.
`,
      reviewCardIds: ['rc-marl-2.5-3', 'rc-marl-2.5-4'],
      illustrations: [],
    },
    {
      id: 'marl-2.5.3',
      title: 'Value Iteration',
      content: `
Policy iteration can be expensive because each cycle requires full policy evaluation -- potentially many sweeps through the entire state space before the values converge. **Value iteration** addresses this by combining policy evaluation and policy improvement into a single update step.

Instead of first converging V^pi and then improving the policy, value iteration applies the **Bellman optimality equation** directly as an update operator:

V_{k+1}(s) <- max_{a in A} sum_{s' in S} T(s' | s, a) * [R(s, a, s') + gamma * V_k(s')]

Notice the max over actions -- this simultaneously evaluates and improves in one shot. Each sweep updates every state's value to reflect the best action available given the current estimates. The algorithm initializes V_0(s) = 0 for all states and repeats the sweeps until convergence.

Like the Bellman expectation operator, the **Bellman optimality operator** is a gamma-contraction mapping. Therefore, by the Banach fixed-point theorem, repeated application converges to the unique fixed point V*. Once V* has been found, the optimal policy is extracted by acting greedily:

pi*(s) = argmax_{a in A} sum_{s' in S} T(s' | s, a) * [R(s, a, s') + gamma * V*(s')]

Value iteration can be thought of as policy iteration with a single sweep of policy evaluation before each improvement. In practice, this is often more efficient than full policy iteration because even a single sweep provides useful information for improving the policy.

For the Mars Rover problem with gamma = 0.95, value iteration converges to V*(Start) = 4.1, V*(Site A) = 6.2, and V*(Site B) = 10 -- the same optimal values obtained by policy iteration.

Both policy iteration and value iteration require complete knowledge of the MDP model (T and R). In many real-world problems, these functions are unknown -- the agent can only learn through interaction. This limitation motivates **temporal-difference learning**, which we cover in the next lesson. TD methods retain the bootstrapping idea from DP but replace the model-based expectations with samples from actual experience, bridging the gap between theory and practice.
`,
      reviewCardIds: ['rc-marl-2.5-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Iterative policy evaluation computes V^pi by repeatedly applying the Bellman equation as an update; convergence is guaranteed by the contraction mapping property.
- Policy improvement constructs a greedy policy with respect to V^pi; the policy improvement theorem guarantees this produces a policy that is at least as good.
- Policy iteration alternates evaluation and improvement, converging to pi* in a finite number of steps.
- Value iteration combines evaluation and improvement in one step using the Bellman optimality equation, converging to V* via the contraction property.
- Both DP methods require full knowledge of T and R, motivating model-free approaches like temporal-difference learning.`,
};

export default lesson;
