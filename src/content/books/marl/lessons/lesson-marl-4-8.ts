/**
 * Lesson 4.8: Computational Complexity of Equilibria
 *
 * Covers: PPAD-completeness of NE, LP for CE, practical algorithms (support enumeration, Lemke-Howson)
 * Source sections: 4.11, 4.12
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-4.8',
  title: 'Computational Complexity of Equilibria',
  sections: [
    {
      id: 'marl-4.8.1',
      title: 'Why Standard Complexity Classes Fall Short',
      content: `Before turning to MARL algorithms for computing equilibria, we should ask: how hard is it, computationally, to find an equilibrium? The answer has profound implications for what we can expect from any algorithm.

Most computer scientists are familiar with the complexity classes **P** (problems solvable in polynomial time) and **NP** (problems whose solutions can be verified in polynomial time). But these classes characterize *decision problems* -- problems that may or may not have solutions. The problem of computing a Nash equilibrium does not fit neatly into this framework, because we know a Nash equilibrium always exists (by Nash's theorem). We are not asking "does a solution exist?" but rather "find one."

That said, computing equilibria with *additional properties* is a decision problem, and many such problems are **NP-hard**:
- Finding a NE that is Pareto-optimal
- Finding a NE that achieves a minimum expected return for each agent
- Finding a NE that achieves a minimum social welfare
- Finding a NE that assigns positive probability to a specific action

These results (Gilboa and Zemel, 1989; Conitzer and Sandholm, 2008) tell us that even checking whether a "good" equilibrium exists is likely intractable.

Some equilibrium types *do* admit efficient computation. **Minimax solutions** in two-agent zero-sum normal-form games are computable in polynomial time via linear programming. **Correlated equilibria** in general-sum normal-form games are also polynomial-time computable via LP. But computing a **Nash equilibrium** in general-sum games is fundamentally harder because the independence constraint between policies cannot be expressed as a linear program.

To properly characterize the complexity of computing Nash equilibria, we need a different complexity class: **PPAD**.`,
      reviewCardIds: ['rc-marl-4.8-1', 'rc-marl-4.8-2'],
      illustrations: [],
    },
    {
      id: 'marl-4.8.2',
      title: 'PPAD-Completeness of Nash Equilibrium',
      content: `**PPAD** (Polynomial Parity Argument for Directed Graphs) is a complexity class designed for total search problems -- problems guaranteed to have solutions. It is defined via a complete problem called **END-OF-LINE**: given a directed graph where each node has at most one parent and one child, and given a source node (no parent), find a sink node (no child) or another source node.

The "parity argument" guarantees a solution exists: any source must have a corresponding sink somewhere in the graph. The challenge is finding it efficiently. The graph has 2^k nodes, and the only obvious algorithm is to follow the path from the given source, which may require exponential time. The graph structure is given implicitly through Parent and Child functions (boolean circuits), not as an explicit edge list.

The landmark result for MARL is that computing a Nash equilibrium (NASH) is **PPAD-complete**. This was proven first for games with three or more agents (Daskalakis, Goldberg, and Papadimitriou, 2006, 2009) and then for two-agent games (Chen and Deng, 2006). More precisely, computing an **epsilon-Nash equilibrium** for certain bounds on epsilon is PPAD-complete, and computing exact equilibria in two-agent games is PPAD-complete.

Why does this matter? Just as it is unknown whether P = NP, it is unknown whether P = PPAD. No polynomial-time algorithms have been found for any PPAD-complete problem despite decades of effort, and PPAD has been shown to be hard under standard cryptographic assumptions. This is strong evidence -- though not proof -- that no efficient algorithm for NASH exists.

The relationship between these complexity classes is: P is a subset of PPAD, which is a subset of NP. If P != NP (as universally conjectured), then PPAD-complete problems are genuinely hard.`,
      reviewCardIds: ['rc-marl-4.8-3', 'rc-marl-4.8-4'],
      illustrations: [],
    },
    {
      id: 'marl-4.8.3',
      title: 'Practical Algorithms and Implications for MARL',
      content: `Despite the worst-case complexity, practical algorithms exist for computing equilibria in reasonably sized games. For **two-agent** normal-form games, two notable approaches are:

**Support enumeration** works by guessing the *support* of each agent's equilibrium policy -- the set of actions played with positive probability. For each candidate support pair, the equilibrium conditions reduce to a system of linear equations (actions in the support must be equally good). If the system has a valid solution (non-negative probabilities summing to 1), we have found a Nash equilibrium. In the worst case, we may need to enumerate all 2^{k_1} * 2^{k_2} possible support combinations, which is exponential but works well for small games.

The **Lemke-Howson algorithm** is a pivoting method (similar to the simplex algorithm for linear programming) specifically designed for two-agent games. It follows a path through the vertices of a polytope defined by the equilibrium conditions, guaranteed to terminate at a Nash equilibrium. While exponential in the worst case, it is often efficient in practice and is one of the most widely used algorithms for computing NE in bimatrix games.

For **correlated equilibrium**, the linear programming approach from Lesson 4.4 remains the gold standard -- it runs in polynomial time but requires variables for each joint action (exponential in the number of agents).

The PPAD-completeness of NASH has a direct implication for MARL: **there probably does not exist an efficient MARL algorithm that computes Nash equilibria for general games in polynomial time.** Much of MARL research focuses on identifying structure in specific game types -- such as zero-sum games, potential games, or games with specific network structures -- that can be exploited for improved performance. But the general result tells us that, without such structure, any MARL algorithm will require exponential time in the worst case.

This does not mean MARL is hopeless -- far from it. Many practically important games have structure that algorithms can exploit, and approximate solutions (epsilon-NE) with small epsilon are often good enough. But the complexity landscape should calibrate our expectations about what is achievable in principle.`,
      reviewCardIds: ['rc-marl-4.8-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- Standard complexity classes P and NP are not well-suited for Nash equilibrium computation because NE always exists (it is a total search problem).
- **PPAD** is a complexity class for total search problems, defined via the END-OF-LINE problem on directed graphs.
- Computing a Nash equilibrium is **PPAD-complete** (even for two-agent games), meaning it is likely intractable -- no polynomial-time algorithm is known.
- Computing equilibria with additional properties (Pareto-optimal, welfare-maximizing) is **NP-hard**.
- **Minimax** (via LP) and **correlated equilibrium** (via LP) are polynomial-time computable, in contrast to Nash equilibrium.
- Practical algorithms like **support enumeration** and **Lemke-Howson** work for small games but are exponential in the worst case.
- The implication for MARL: no efficient general-purpose algorithm for NE likely exists; exploiting game-specific structure is essential.`,
};

export default lesson;
