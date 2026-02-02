/**
 * Lesson 9.3: Presenting Results and Matrix Games
 *
 * Covers: Reporting results (learning curves, confidence intervals),
 * matrix games as diagnostics, classic matrix games
 * Source sections: 10.6, 11.1, 11.2
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-9.3',
  title: 'Presenting Results and Matrix Games',
  sections: [
    {
      id: 'marl-9.3.1',
      title: 'Reporting MARL Results: Learning Curves and Confidence Intervals',
      content: `
Comparing algorithms in MARL is harder than in supervised learning or even single-agent RL. Two factors make it especially tricky: (1) extreme **sensitivity to hyperparameters and random seeds**, and (2) solution concepts that go beyond one-dimensional metrics like accuracy.

The standard tool is the **learning curve**: a plot with training time steps on the x-axis and estimated episodic returns on the y-axis. Creating a proper learning curve requires two ingredients. First, an **evaluation procedure** that periodically pauses training, runs the current policy for several episodes (without exploration noise), and records the mean return. Second, you must run the *entire experiment* across **multiple random seeds** (typically 5-10) and plot the mean performance with **standard error** or standard deviation bands to convey statistical reliability.

In **common-reward** cooperative games, learning curves work well -- the shared reward gives a single interpretable signal. But in **zero-sum** games, they can be misleading. If two agents train against each other, their returns are mirror images (one's gain is the other's loss), so neither curve shows whether agents are actually improving. The solution is to evaluate learned agents against a **fixed baseline** -- a pretrained or heuristic opponent. This reveals whether agent skill is genuinely increasing, even if the agents appear to be "stuck" when measured against each other.

You can condense a learning curve into a single number: either the **maximum** (did the algorithm ever solve the task?) or the **average** (how fast and stable was learning?). The maximum is often more informative because many algorithms fluctuate. But when multiple algorithms reach the same peak, the average distinguishes them by **sample efficiency and stability**. When comparing algorithms, always ensure each received a **comparable hyperparameter search budget** -- otherwise the comparison is unfair.
`,
      reviewCardIds: ['rc-marl-9.3-1', 'rc-marl-9.3-2'],
      illustrations: [],
      codeExamples: [
        {
          title: 'Plotting learning curves with confidence intervals',
          language: 'python',
          code: `import numpy as np
import matplotlib.pyplot as plt

# results: shape [n_seeds, n_eval_points]
results = np.array([run_experiment(seed=s) for s in range(10)])

mean = results.mean(axis=0)
stderr = results.std(axis=0) / np.sqrt(results.shape[0])
x = np.arange(results.shape[1]) * eval_interval

plt.plot(x, mean, label="Algorithm A")
plt.fill_between(x, mean - stderr, mean + stderr, alpha=0.2)
plt.xlabel("Environment time steps")
plt.ylabel("Mean evaluation return")
plt.legend()
plt.title("Learning curve with standard error (10 seeds)")`,
        },
      ],
    },
    {
      id: 'marl-9.3.2',
      title: 'Matrix Games as Diagnostic Tools',
      content: `
Before testing your MARL algorithm on complex environments with thousands of state dimensions, it pays to check whether it handles the *fundamentals* correctly. **Matrix games** -- normal-form games with just two agents and two actions each -- serve as ideal diagnostic benchmarks.

Why are matrix games useful? Because their small size (a 2x2 reward table) means we can **compute exact solutions** analytically. We know the Nash equilibria, correlated equilibria, and minimax solutions. We can then check whether a learning algorithm converges to the correct solution concept, how quickly it converges, and whether it exhibits pathological behaviors like cycling.

Chapter 11 presents a complete taxonomy of all **78 structurally distinct** strictly ordinal 2x2 games, based on the classification by Rapoport and Guyer (1966). "Structurally distinct" means no game can be transformed into another by swapping rows, columns, or agents. "Strictly ordinal" means each agent ranks the four outcomes from 1 (least preferred) to 4 (most preferred), with no ties. These 78 games are divided into **no-conflict games** and **conflict games**.

In a **no-conflict game**, both agents agree on which outcomes are best -- they share the same set of most-preferred joint actions. These are the easiest to solve: if agents can find the mutually preferred outcome, they should converge to it. There are 21 no-conflict games in the taxonomy.

In a **conflict game**, agents disagree about the most preferred outcomes. This is where the interesting MARL phenomena arise -- coordination problems, social dilemmas, and competitive dynamics. Famous examples include the **Prisoner's Dilemma** (individual incentives lead to collectively suboptimal outcomes), **Chicken** (two equilibria, each favoring a different agent), and **Stag Hunt** (coordination is required to reach the best outcome, but a safe fallback exists). There are 57 conflict games in the taxonomy.

Testing your algorithm on all 78 games takes seconds and reveals fundamental issues that would take hours to diagnose in a complex environment.
`,
      reviewCardIds: ['rc-marl-9.3-3', 'rc-marl-9.3-4'],
      illustrations: [],
      codeExamples: [
        {
          title: 'Defining classic matrix games for testing',
          language: 'python',
          code: `import numpy as np

# Prisoner's Dilemma (ordinal version)
# Actions: Cooperate (0), Defect (1)
# Payoffs: agent ranks outcomes 1 (worst) to 4 (best)
prisoners_dilemma = {
    "R1": np.array([[3, 1],   # Agent 1 payoffs
                    [4, 2]]),
    "R2": np.array([[3, 4],   # Agent 2 payoffs
                    [1, 2]]),
}
# Nash equilibrium: (Defect, Defect) -> payoffs (2, 2)

# Stag Hunt
stag_hunt = {
    "R1": np.array([[4, 1],
                    [3, 2]]),
    "R2": np.array([[4, 3],
                    [1, 2]]),
}
# Two Nash equilibria: (Stag, Stag) and (Hare, Hare)

# Chicken (Hawk-Dove)
chicken = {
    "R1": np.array([[3, 2],
                    [4, 1]]),
    "R2": np.array([[3, 4],
                    [2, 1]]),
}
# Two pure NE: (Dove, Hawk) and (Hawk, Dove)`,
        },
      ],
    },
    {
      id: 'marl-9.3.3',
      title: 'Classic Matrix Games and What They Test',
      content: `
Each category of matrix game tests a different capability of your MARL algorithm. Let us walk through the key games and what behaviors they reveal.

**Prisoner's Dilemma** is the iconic social dilemma. Both agents prefer the (Cooperate, Cooperate) outcome with payoffs (3, 3), but each has an individual incentive to defect. The unique Nash equilibrium is (Defect, Defect) with payoffs (2, 2) -- collectively worse. This game tests whether your algorithm finds Nash equilibria even when they are Pareto-dominated. Algorithms that naively maximise individual reward will correctly converge to mutual defection; cooperative algorithms might find the socially optimal outcome instead.

**Stag Hunt** is a coordination game with two pure Nash equilibria: (Stag, Stag) with payoffs (4, 4) and (Hare, Hare) with payoffs (2, 2). The first is **payoff-dominant** (both agents prefer it) but the second is **risk-dominant** (choosing Hare guarantees at least 2 regardless of the other agent). This game tests whether your algorithm can coordinate on the superior equilibrium or settles for the safe option. Independent learners often converge to (Hare, Hare) because the exploration phase does not reliably build mutual trust.

**Chicken** (also called Hawk-Dove) has two asymmetric pure Nash equilibria: (Hawk, Dove) and (Dove, Hawk), plus a mixed equilibrium. This tests whether your algorithm can break symmetry -- since the agents are symmetric, they need to somehow agree on which equilibrium to select. Algorithms that treat agents identically may oscillate between the two.

These games also help verify **hyperparameter sensitivity**. If your algorithm fails on Stag Hunt with one learning rate but succeeds with another, that tells you something important about its exploration-exploitation balance. The beauty of matrix games is that experiments run in *seconds*, letting you sweep over hundreds of configurations before committing to expensive runs on complex environments like SMAC or LBF. Think of matrix games as your MARL **unit tests** -- they catch bugs and conceptual errors before they become expensive.
`,
      reviewCardIds: ['rc-marl-9.3-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Learning curves must be plotted across multiple seeds with standard error bands; in zero-sum games, evaluate against a fixed baseline rather than the co-learning opponent.
- Condense curves into single metrics: maximum (did it ever solve the task?) or average (how fast and stable was learning?).
- The 78 structurally distinct 2x2 matrix games provide a complete diagnostic test suite, split into 21 no-conflict games and 57 conflict games.
- Prisoner's Dilemma tests whether an algorithm finds Nash equilibria even when they are Pareto-dominated; Stag Hunt tests coordination under risk; Chicken tests symmetry-breaking.
- Matrix games are MARL unit tests: they run in seconds and reveal fundamental issues before you invest in expensive complex-environment runs.`,
};

export default lesson;
