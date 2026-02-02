import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-2.7',
  title: 'Evaluation with Learning Curves',
  sections: [
    {
      id: 'marl-2.7.1',
      title: 'Learning Curves',
      content: `
Once you have implemented an RL algorithm, how do you measure whether it is working? The standard approach is to plot **learning curves** that show the performance of the learned policy as a function of increasing training time.

A learning curve typically plots training time on the x-axis and a performance metric on the y-axis. The most natural performance metric is the **evaluation return**: the expected discounted return achieved by the learned policy. At regular intervals during training, you "freeze" the current Q-values, extract the greedy policy, and evaluate it by running episodes in the environment and recording the average discounted return. This answers the practical question: "If I stop training now and deploy the greedy policy, how well will it perform?"

An important convention: the x-axis should show **cumulative environment time steps** across all episodes, not the number of completed episodes. This distinction matters because different algorithms (or even different runs of the same algorithm) may use different numbers of time steps per episode. If algorithm A explores heavily and uses many time steps per episode while algorithm B terminates quickly, plotting by episode count would make A appear slower even if both algorithms use the same total amount of experience. Cumulative time steps provide a fair comparison because they directly measure the amount of interaction data the algorithm has consumed.

The y-axis can show different metrics depending on what is most informative. Discounted returns directly reflect the learning objective and are the most principled choice. However, **undiscounted returns** (gamma = 1) are sometimes easier to interpret -- for example, in a game where each enemy destroyed gives +1 reward, the undiscounted return directly counts enemies destroyed, while the discounted return is a less intuitive weighted sum. **Episode length** is another useful secondary metric that can reveal whether the agent is learning to reach goals efficiently. In the Mars Rover problem, a decrease in episode length indicates the agent is finding shorter paths to the base station.

When showing undiscounted returns or auxiliary metrics, remember that the policy was not optimized for these objectives. Two RL problems with the same MDP but different discount factors can have different optimal policies, so interpretation requires care.
`,
      reviewCardIds: ['rc-marl-2.7-1', 'rc-marl-2.7-2'],
      illustrations: [],
    },
    {
      id: 'marl-2.7.2',
      title: 'Averaging Over Seeds',
      content: `
RL algorithms involve substantial randomness: the initial state is sampled from mu, actions are sampled from the policy, transitions are stochastic, and random number generators determine the sequence of exploration choices. A single training run can be highly variable, and conclusions drawn from one run are unreliable.

The standard practice is to **average results over multiple independent training runs**, each using a different random seed. A typical setup might use 100 independent seeds. For each run, you periodically extract the greedy policy, evaluate it over many episodes (say, 100), compute the average return, and record this value. The learning curve you ultimately plot shows the mean of these averaged returns across all training runs, along with a measure of variability.

The **shaded area** commonly shown around learning curves represents the **standard deviation** across training runs. This gives a sense of how much the learning process varies from run to run. A narrow shaded region indicates reliable, consistent learning, while a wide region suggests high variance -- the algorithm might sometimes learn well and sometimes poorly, depending on the random seed.

In the Mars Rover experiments, Sarsa and Q-learning are averaged over 100 independent training runs. Each point on the learning curve is computed by: (1) extracting the greedy policy from each training run at that time step, (2) running 100 evaluation episodes with each greedy policy, (3) averaging the returns from those episodes to get a per-run average, and (4) averaging across all 100 training runs to get the final plotted value.

This multi-level averaging is essential for scientific rigor. Without it, you might conclude that one algorithm is better than another based on nothing more than lucky or unlucky random seeds. The number of seeds needed depends on the problem's inherent stochasticity and the desired statistical confidence, but using fewer than 10-20 runs is generally considered insufficient for reliable comparisons.
`,
      reviewCardIds: ['rc-marl-2.7-3', 'rc-marl-2.7-4'],
      illustrations: [],
    },
    {
      id: 'marl-2.7.3',
      title: 'Evaluation Best Practices',
      content: `
Beyond plotting learning curves with proper averaging, several best practices help ensure meaningful evaluation of RL algorithms.

**Separate training and evaluation.** The returns collected during training include the effects of exploration (random actions, suboptimal choices). Evaluation should use the **greedy policy** (or the learned policy without exploration noise) to measure the agent's true capability. This separation ensures the evaluation reflects the quality of the learned policy, not the randomness of the exploration process.

**Choose hyperparameters carefully and report their impact.** Learning curves are sensitive to choices like the learning rate alpha and exploration rate epsilon. In the Mars Rover Q-learning experiments, different learning rates lead to dramatically different learning speeds. A decaying rate alpha_k = 1/k works well for small MDPs but can be too slow for larger problems where constant rates are preferred. Similarly, the exploration schedule matters: linearly decaying epsilon from 1.0 to 0 over a fixed number of steps is a common and reasonable starting point, but the decay horizon should be tuned to the problem. When reporting results, it is good practice to show sensitivity to key hyperparameters, as done in the book's comparison of multiple alpha and epsilon schedules.

**Include baselines and optimal values.** Whenever possible, plot the optimal value V*(s_0) as a dashed horizontal line on the learning curve. This gives an immediate visual indication of how close the algorithm is to the theoretical optimum. In the Mars Rover example, the optimal value V*(Start) = 4.1 (computed via value iteration) serves as this reference. Comparing against known baselines -- such as a random policy or a simpler algorithm -- also helps contextualize the results.

**Match the evaluation metric to the learning objective.** If the agent was trained to maximize discounted returns with gamma = 0.95, the primary evaluation metric should be discounted returns with gamma = 0.95. Showing undiscounted returns or other secondary metrics is fine for additional insight, but the primary metric should reflect the actual objective. Two problems with different gamma values may have different optimal policies, so mixing metrics across different objectives can lead to misleading conclusions.

These practices carry over directly to the multi-agent setting, where evaluation becomes even more nuanced because multiple agents interact and the definition of "optimal" depends on the solution concept being used.
`,
      reviewCardIds: ['rc-marl-2.7-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Learning curves plot policy performance (typically evaluation returns) against cumulative environment time steps, providing the standard way to assess RL algorithms.
- Use cumulative time steps (not episode count) on the x-axis to ensure fair comparison across algorithms.
- Average results over many independent random seeds (typically 30-100+) and show standard deviation to capture variability.
- Evaluate the greedy policy separately from training to measure true learned performance without exploration noise.
- Always include the optimal value as a baseline, report hyperparameter sensitivity, and match the evaluation metric to the learning objective.`,
};

export default lesson;
