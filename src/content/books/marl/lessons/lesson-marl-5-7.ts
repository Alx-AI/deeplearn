/**
 * Lesson 5.7: Chapter Integration: The MARL Landscape
 *
 * Covers: MARL taxonomy, challenge-solution mapping, preview of
 * foundational algorithms
 * Source sections: 5.6
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-5.7',
  title: 'Chapter Integration: The MARL Landscape',
  sections: [
    {
      id: 'marl-5.7.1',
      title: 'A Taxonomy of MARL Approaches',
      content: `
This chapter has taken us from the general MARL learning loop to the fundamental challenges that distinguish multi-agent learning from its single-agent counterpart. Before moving to the specialized algorithms in Chapter 6, let's organize everything into a clear **taxonomy**.

The most basic division is by **degree of centralization**:

- **Central learning** trains a single policy over the joint-action space. It treats the multi-agent problem as a large single-agent problem. Strength: avoids non-stationarity and naturally handles credit assignment through joint-action values. Weakness: the joint-action space grows exponentially with the number of agents, and it requires centralized observation and control.

- **Independent learning** lets each agent learn its own policy using only local information. Strength: scales to each agent's individual action space and supports decentralized execution. Weakness: faces non-stationarity from concurrent learners, cannot explicitly model other agents' contributions, and may fail to converge.

Cross-cutting this division is the **mode of operation**:

- **Algorithm self-play:** All agents use the same learning algorithm with separate parameters. This is the standard assumption for theoretical analysis.
- **Policy self-play:** A single shared policy is trained against copies of itself. Enables data pooling but requires symmetrical agent roles.
- **Mixed-play:** Agents use different algorithms. Models open, real-world environments but lacks strong convergence guarantees.

And cutting across both dimensions are the **convergence criteria**, ranging from the strongest (policy convergence) through weaker alternatives (convergence of expected return, empirical distribution, set convergence, average return). Each algorithm we will encounter can be characterized by which game settings it applies to, what convergence type it achieves, and under what mode of operation.

This taxonomy gives us a systematic way to evaluate any MARL algorithm: what does it assume about centralization? What mode of operation does it require? And what does it guarantee about convergence?
`,
      reviewCardIds: ['rc-marl-5.7-1', 'rc-marl-5.7-2'],
      illustrations: [],
    },
    {
      id: 'marl-5.7.2',
      title: 'Challenge-Solution Mapping',
      content: `
The four core challenges of MARL -- non-stationarity, equilibrium selection, credit assignment, and scalability -- interact in complex ways. Understanding how different approaches address (or fail to address) each challenge is essential for choosing the right algorithm for a given problem.

**Non-stationarity** arises from concurrent learning. Central learning sidesteps it entirely (one controller, one environment), but at the cost of scalability. Independent learning faces it head-on. Specialized algorithms address it through careful learning rate schedules (WoLF-PHC uses different rates when "winning" versus "losing"), opponent modeling (predicting other agents' policies to reduce perceived non-stationarity), or by explicitly accounting for other agents' learning in the update rule.

**Equilibrium selection** is a problem whenever the game has multiple equilibria. In zero-sum games, minimax values are unique, which eliminates the issue. In no-conflict cooperative games, Pareto optimality provides a natural selection criterion. In general-sum games, the problem remains open. Approaches include solution refinements, communication protocols, and agent modeling to predict and coordinate on shared equilibria.

**Credit assignment** is hardest in common-reward settings and scales poorly with the number of agents. Joint-action value functions (as in central learning and joint-action learning) can disentangle individual contributions. Difference rewards use counterfactual reasoning. Value decomposition methods (QMIX, VDN) learn to factorize joint values into per-agent components. These approaches will be central in later chapters.

**Scalability** compounds all other challenges. More agents mean larger joint-action spaces, more non-stationarity, harder credit assignment, and more potential equilibria. Deep learning and function approximation are the primary tools for tackling scale, replacing exponential tables with neural networks that can generalize across the joint space.

No single approach solves all four challenges simultaneously. The most successful modern methods combine elements: **centralized training with decentralized execution** (CTDE) uses centralized information during training (addressing credit assignment and equilibrium selection) while producing decentralized policies for execution (addressing scalability and real-world deployment constraints).
`,
      reviewCardIds: ['rc-marl-5.7-3', 'rc-marl-5.7-4'],
      illustrations: [],
    },
    {
      id: 'marl-5.7.3',
      title: 'Preview of Foundational Algorithms',
      content: `
Chapter 6 will move beyond the basic central and independent learning approaches introduced here, presenting several families of specialized MARL algorithms that explicitly model and exploit the multi-agent structure. Here is a preview of what lies ahead, mapped to the challenges they address.

**Joint-action learning** (Section 6.2) extends independent learning by having each agent model the other agents' action distributions. Algorithms like **Minimax-Q** learn joint-action values in zero-sum stochastic games, exploiting the unique minimax equilibrium values to guarantee convergence. **Nash-Q** generalizes this to general-sum games by computing Nash equilibria of the stage game at each state, though it faces the computational cost of equilibrium computation and the equilibrium selection problem.

**Agent modeling and fictitious play** (Section 6.3) tackle non-stationarity by explicitly predicting other agents' behaviors. **Fictitious play** maintains a running average of each opponent's historical action frequencies and best-responds to that average. It converges (in empirical distribution) in certain game classes, including zero-sum games and potential games.

**Policy gradient methods** (Section 6.4) work directly in policy space rather than value space. **Infinitesimal Gradient Ascent (IGA)** and its variant **WoLF-IGA** are proven to converge in two-player, two-action games. **WoLF-PHC** extends the "Win or Learn Fast" principle to larger settings, using two learning rates -- a slower rate when "winning" and a faster rate when "losing" -- to dampen oscillations.

**Regret-based methods** (Section 6.5) approach the problem through the lens of regret minimization. **Regret matching** guarantees that the empirical distribution of play converges to the set of coarse correlated equilibria in any finite game, providing one of the broadest convergence results in MARL.

Each of these algorithm families makes different tradeoffs among the four challenges. Understanding the taxonomy from this chapter -- centralization, mode of operation, convergence criteria -- will provide the framework for evaluating them as we go.
`,
      reviewCardIds: ['rc-marl-5.7-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- MARL approaches can be organized by degree of centralization (central vs. independent learning), mode of operation (algorithm self-play, policy self-play, mixed-play), and convergence criteria (from policy convergence to average return convergence).
- The four core MARL challenges -- non-stationarity, equilibrium selection, credit assignment, and scalability -- interact and compound each other; no single approach solves all four simultaneously.
- Centralized training with decentralized execution (CTDE) is the dominant modern paradigm, combining centralized information during training with decentralized policies for deployment.
- Chapter 6 introduces specialized algorithms: joint-action learning (Minimax-Q, Nash-Q), agent modeling and fictitious play, policy gradient methods (IGA, WoLF), and regret-based methods -- each addressing different subsets of the core challenges.
- The taxonomy of centralization, operation mode, and convergence type provides a systematic framework for evaluating any MARL algorithm.`,
};

export default lesson;
