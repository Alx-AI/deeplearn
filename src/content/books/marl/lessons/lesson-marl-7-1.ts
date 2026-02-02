/**
 * Lesson 7.1: Function Approximation for RL
 *
 * Covers: Curse of dimensionality, function approximation idea, deadly triad
 * Source sections: 7.1, 7.2
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-7.1',
  title: 'Function Approximation for RL',
  sections: [
    {
      id: 'marl-7.1.1',
      title: 'The Curse of Dimensionality in Tabular Methods',
      content: `
In Part I we represented value functions and policies as large tables -- one entry per state or state-action pair. Those **tabular methods** have clean theoretical guarantees, but they hit a hard wall when environments grow even moderately complex.

The first problem is sheer size. Consider the board game of Go: its state space contains roughly 10^170 possible board positions. Storing a single floating-point value for each state is physically impossible on any computer we could ever build. Even simpler video-game environments routinely have millions of distinguishable screen frames. A table that large is infeasible to store, let alone update enough times for every entry to converge.

The second problem is **generalisation**, or rather the complete lack of it. When a tabular agent visits state s and updates Q(s, a), the value estimates for every other state remain untouched. The agent must literally experience each state many times before it can produce an accurate value there. In a maze environment, for instance, two states with nearly identical distances to the goal will have independent value entries. Even if the agent has thoroughly explored one of those states, it learns nothing about the other.

These twin problems -- combinatorial explosion and no generalisation -- are what motivate **function approximation**. Instead of maintaining a table, we learn a parameterised function f(x; theta) that maps inputs (states, state-action pairs, or observations) to value estimates or action probabilities. Because the same parameters theta are shared across all inputs, updating the function after one experience can shift predictions for many related inputs simultaneously. That is generalisation, and it is the key ingredient that allows RL to scale to complex tasks like robotic control, Atari games, and real-world logistics.

The idea is straightforward: find parameters theta such that f(x; theta) is close to a target function f*(x) for all relevant inputs x. The challenge lies in how to search for those parameters efficiently, and how to avoid the pitfalls that arise when function approximation meets the bootstrapping and off-policy learning that RL depends on.
`,
      reviewCardIds: ['rc-marl-7.1-1', 'rc-marl-7.1-2'],
      illustrations: [],
    },
    {
      id: 'marl-7.1.2',
      title: 'Linear Function Approximation and Feature Design',
      content: `
The simplest form of function approximation is a **linear value function**. We define a feature vector x(s) that encodes state s as a d-dimensional vector, and then compute the approximate state value as a dot product:

V-hat(s; theta) = theta^T x(s) = sum_{k=1}^{d} theta_k * x_k(s)

Here theta is the parameter vector we optimise. Note that the function is linear in the features x(s), not necessarily in the raw state. The feature vector could include polynomial terms, radial-basis-function outputs, or any hand-crafted encoding, so the value function can capture non-linear relationships with the raw state -- as long as someone designs the right features.

Training proceeds by **gradient-based optimisation**. Suppose we know the true values V^pi(s) for a batch of states. We define a mean-squared-error loss and follow its negative gradient to update theta. With each update, the approximate value function shifts toward the true values -- not just for the states in the current batch, but for all states whose feature vectors are similar, because the same theta is reused everywhere.

This ability to generalise is powerful. In the textbook's maze example, states at similar distances from the goal tend to share similar feature representations, so training on a handful of states lets the agent infer reasonable values for many others it has never visited.

The limitation of linear function approximation is equally clear: the value function is constrained to be a linear combination of whatever features you choose. If the features do not capture the right structure, no setting of theta will produce accurate values. Designing good features requires **domain knowledge**, and for high-dimensional inputs like images or natural-language observations, finding adequate features by hand is essentially impossible.

This is exactly the gap that **deep learning** fills. Neural networks learn their own feature representations from raw inputs, removing the need for manual feature engineering while retaining -- and vastly extending -- the generalisation benefits of function approximation.
`,
      reviewCardIds: ['rc-marl-7.1-3', 'rc-marl-7.1-4'],
      illustrations: [],
    },
    {
      id: 'marl-7.1.3',
      title: 'The Deadly Triad: Function Approximation Meets Bootstrapping',
      content: `
Replacing a table with a function approximator is not free of risk. In fact, the combination of three ingredients commonly found in RL -- **function approximation**, **bootstrapped targets**, and **off-policy learning** -- is known as the **deadly triad** (Sutton and Barto, 2018). When all three are present simultaneously, value estimates can become unstable or even diverge.

To see why, consider a deep Q-learning agent. It maintains a neural-network value function Q(s, a; theta). The target for each update uses a bootstrapped estimate: y_t = r_t + gamma * max_{a'} Q(s_{t+1}, a'; theta). Because Q is a function approximator, updating theta to reduce the error for one state-action pair may inadvertently change the value estimates for many other state-action pairs -- including the very next-state estimate used in the target. The target itself is therefore a **moving target**, shifting with every gradient step.

Now add off-policy learning. The agent collects experience using a behaviour policy (e.g. epsilon-greedy) that differs from the greedy policy it is trying to learn. The bootstrapped target selects max_{a'} Q(s_{t+1}, a'), but the behaviour policy may never actually execute that greedy action in s_{t+1}. If the function approximator happens to overestimate the value of that action, the error can feed back on itself: the overestimate inflates the target, which inflates the parameters, which inflates the estimate further. With no corrective visit to that state-action pair, the value can spiral upward without bound.

Crucially, removing any one leg of the triad restores stability. Without function approximation, updating one state's value leaves all others unchanged. Without bootstrapping, targets are computed from actual returns and cannot self-reinforce. Without off-policy data, the agent regularly visits the states it bootstraps from, so overestimates get corrected.

Understanding the deadly triad motivates the two key stabilisation techniques we will meet in the DQN lesson: **target networks** to slow the moving-target problem, and **experience replay** to break the temporal correlations that make off-policy updates especially fragile.
`,
      reviewCardIds: ['rc-marl-7.1-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Tabular RL methods cannot scale to large state spaces (curse of dimensionality) and do not generalise across similar states.
- Function approximation learns a parameterised function f(x; theta) that shares parameters across inputs, enabling generalisation to unseen states.
- Linear function approximation is simple but limited -- it requires hand-designed features and can only represent linear functions of those features.
- Deep learning removes the need for manual feature design by learning representations directly from raw inputs.
- The deadly triad (function approximation + bootstrapped targets + off-policy learning) can cause value estimates to diverge, motivating stabilisation techniques like target networks and experience replay.`,
};

export default lesson;
