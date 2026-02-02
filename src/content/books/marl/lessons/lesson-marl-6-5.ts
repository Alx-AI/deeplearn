/**
 * Lesson 6.5: Joint-Action Learning with Agent Models
 *
 * Covers: Model-based value computation, frequency-based models, model accuracy tradeoff
 * Source sections: 6.3.2
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-6.5',
  title: 'Joint-Action Learning with Agent Models',
  sections: [
    {
      id: 'marl-6.5.1',
      title: 'Model-Based Value Computation (JAL-AM)',
      content: `
Fictitious play works for one-shot normal-form games, but real multi-agent problems typically unfold over many time steps in a stochastic game. We need a method that combines the agent-modeling idea from fictitious play with the temporal-difference learning framework from joint-action learning. This combination is **JAL-AM** -- Joint-Action Learning with Agent Modeling.

The core idea: agent i maintains a single joint-action Q-function Q_i(s, a) (unlike JAL-GT, which maintains Q-functions for **all** agents). Agent i also maintains models pi_hat_j(a_j | s) for each other agent j. The model and Q-values together let agent i compute the expected value of any action a_i in state s:

**AV_i(s, a_i) = sum_{a_{-i}} Q_i(s, (a_i, a_{-i})) * product_{j != i} pi_hat_j(a_j | s)**

This **action value** marginalizes over the other agents' actions, weighted by their predicted probabilities. Agent i's best-response action in state s is then simply:

a_i = argmax_{a_i} AV_i(s, a_i)

The TD update uses this same AV function for the bootstrap target:

Q_i(s_t, a_t) <-- Q_i(s_t, a_t) + alpha * [r^t_i + gamma * max_{a'_i} AV_i(s_{t+1}, a'_i) - Q_i(s_t, a_t)]

Notice two important differences from JAL-GT. First, agent i only needs its **own** Q-function and its own reward -- no need to observe other agents' rewards. Second, the update target uses a best-response max over agent i's actions (conditioned on the learned models), rather than a game-theoretic solver over all agents' Q-functions.
`,
      reviewCardIds: ['rc-marl-6.5-1', 'rc-marl-6.5-2'],
      illustrations: [],
    },
    {
      id: 'marl-6.5.2',
      title: 'Frequency-Based Agent Models',
      content: `
The agent models in JAL-AM are analogous to the empirical distributions used in fictitious play, but now conditioned on the **state**. Let C(s, a_j) be the number of times agent j chose action a_j in state s. The model is:

pi_hat_j(a_j | s) = C(s, a_j) / (sum over a'_j of C(s, a'_j))

When state s is visited for the first time, the model defaults to a uniform distribution. This state-conditioning is sensible because optimal policies in stochastic games depend only on the current state, so the other agents' behaviors should be modeled as state-dependent.

If agent j's true policy pi_j is fixed and conditioned on states, then with enough observations of each (s, a_j) pair, the model pi_hat_j will converge to pi_j. Of course, during learning, pi_j is **not** fixed -- agent j is also learning and adapting. This creates a **moving target problem**: by the time you have an accurate model of agent j's policy, agent j may have changed it.

Empirical evaluation in the **level-based foraging** task shows promising results. JAL-AM converged to the optimal joint policy faster than both independent Q-learning (IQL) and central Q-learning (CQL). The agent models reduced variance in the update targets, as reflected in a smaller standard deviation across training runs. JAL-AM converged (on average) after about 500,000 time steps, compared to 600,000 for IQL. The reduced variance comes from the fact that instead of ignoring other agents (IQL) or requiring a single central controller (CQL), JAL-AM explicitly accounts for other agents' likely actions through its models.
`,
      reviewCardIds: ['rc-marl-6.5-3', 'rc-marl-6.5-4'],
      illustrations: [],
    },
    {
      id: 'marl-6.5.3',
      title: 'The Model Accuracy Tradeoff',
      content: `
The frequency-based model from the previous section uses the **entire** history of observations for each (s, a_j) pair. This maximizes data efficiency but creates a problem: if agent j changed its policy 50,000 steps ago, the model still incorporates those obsolete observations, making it slow to track changes.

Several strategies address this **recency-accuracy tradeoff**:

**Windowed counts.** Only use the most recent k observations of agent j in state s. For example, keep only the last 10 observed actions. This makes the model responsive to changes but throws away potentially useful data from earlier.

**Exponential weighting.** Apply a decay factor to older observations, giving more weight to recent actions. This provides a smooth tradeoff between responsiveness and stability.

**Bayesian updating.** Maintain a probability distribution over a space of possible models, and update it based on new observations. We will explore this approach in detail in the next lesson.

There is a deeper issue at play. JAL-AM learns **best-response actions** (deterministic), not best-response **policies** (probabilistic). This is the same limitation as fictitious play. If the equilibrium requires agent i to randomize over actions in some state, JAL-AM cannot represent that equilibrium directly.

Additionally, the combination of changing agent models and changing Q-values introduces a subtle interaction. The Q-values are learned under one set of agent models, but by the time they are used, the models may have shifted. This co-adaptation between Q-learning and agent modeling can cause instability, especially in early training when both models and Q-values are poor estimates.

Despite these challenges, JAL-AM represents a significant practical improvement over both independent learning (which ignores other agents) and JAL-GT (which requires reward observability and game-theoretic solvers). It strikes a pragmatic balance: model other agents simply, compute best responses efficiently, and let temporal-difference learning handle the long-term planning.
`,
      reviewCardIds: ['rc-marl-6.5-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- JAL-AM combines frequency-based agent models with TD learning, requiring only agent i's own Q-function and reward (not other agents' rewards).
- The action value AV_i(s, a_i) marginalizes the joint Q-value over predicted opponent actions, enabling best-response action selection.
- State-conditioned frequency models converge to the true policy if it is stationary, but face a moving-target problem during learning.
- JAL-AM outperformed both IQL and CQL in level-based foraging, converging faster with lower variance.
- The recency-accuracy tradeoff can be addressed by windowed counts, exponential weighting, or Bayesian methods.`,
};

export default lesson;
