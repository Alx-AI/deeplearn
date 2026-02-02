/**
 * Lesson 8.9: Self-Play and AlphaZero
 *
 * Covers: AlphaGo to AlphaZero evolution, MCTS + neural networks, tabula rasa learning
 * Source sections: 9.8
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-8.9',
  title: 'Self-Play and AlphaZero',
  sections: [
    {
      id: 'marl-8.9.1',
      title: 'Monte Carlo Tree Search for Decision Making',
      content: `
We now turn to a completely different setting: two-player zero-sum turn-taking games like chess, Go, and shogi. These games have three features that make them exceptionally challenging for RL:

1. **Sparse reward:** the only non-zero reward comes at the end of the game (+1 for win, -1 for loss, 0 for draw). No intermediate feedback.
2. **Large action space:** many possible moves at each turn create a wide branching factor in the game tree.
3. **Long horizon:** games can last hundreds of moves, requiring planning far into the future.

**Monte Carlo Tree Search (MCTS)** addresses these challenges through intelligent sampling. In each game state s_t, MCTS performs k simulations. Each simulation traverses the existing search tree by selecting actions, extends the tree when it reaches an unvisited state, evaluates that state, and backpropagates the evaluation.

The key components:

- **ExploreAction:** selects which action to try in a visited state. A common choice is **UCB** (Upper Confidence Bound): choose the action maximizing Q(s, a) + sqrt(2 ln N(s) / N(s, a)), which balances exploitation (high Q) with exploration (low visit count N).

- **InitializeNode:** when a new state s_l is reached, creates a tree node with counters N(s_l, a) = 0 and values Q(s_l, a) = 0 for all actions. An evaluation function f(s_l) provides an initial value estimate u.

- **Backpropagation:** propagates the evaluation u backward through the visited nodes, updating Q-values. For games where all rewards are zero until the terminal state, we can directly average: Q(s, a) <- Q(s, a) + (1/N(s,a)) * (u - Q(s, a)).

- **BestAction:** after all k simulations, selects an action for the current state, typically the most-visited action: a_t in argmax_a N(s_t, a).

MCTS is essentially RL applied to a *single state*: it explores, evaluates, and converges to optimal actions without needing a complete policy. The evaluation function f is crucial -- it determines the quality of the value estimates that guide the search.
`,
      reviewCardIds: ['rc-marl-8.9-1', 'rc-marl-8.9-2'],
      illustrations: [],
    },
    {
      id: 'marl-8.9.2',
      title: 'Self-Play MCTS in Zero-Sum Games',
      content: `
**Policy self-play** trains an agent by having it play against itself. The same policy controls both players, which requires that the game has symmetric roles and **egocentric observations** -- observations that are relative to the current player.

In chess, this means transforming the board so it always looks like "your pieces are at the bottom." Formally, when it is agent 2's turn with state s = (2, x, y), we apply a transformation psi(s) = (1, y, x) -- swapping agent identity and piece positions -- so agent 1's policy can be used from agent 2's perspective.

Self-play MCTS adapts the general MCTS algorithm by:

1. **Alternating perspectives:** the simulation alternates between the two players. When it is agent 1's turn, the state is used directly. When it is agent 2's turn, the state is transformed via psi before querying the policy.

2. **Flipping values during backpropagation:** the evaluation u = f(s_l) is always from agent 1's perspective (e.g., +1 if agent 1 wins). When backpropagating through a state where it was agent 2's turn, the sign of u is flipped, since a win for agent 1 is a loss for agent 2.

The self-play simulation sequence looks like:

pi_1(s^t_1) -> a^t -> pi_1(psi(s^{t+1}_2)) -> a^{t+1} -> pi_1(s^{t+2}_1) -> a^{t+2} -> ...

This creates an MDP from agent 1's perspective, where the "environment" includes the opponent's actions chosen by the same policy.

An important extension: instead of always playing against the *current* policy, maintain a set Pi of policy copies from different training stages and occasionally sample the opponent from this set. Training against diverse past versions produces a more robust policy that does not overfit to itself. This idea -- playing against a distribution of past selves -- connects to population-based training, which we will explore in the next lesson.

Self-play requires that agents have symmetric roles, which holds for most competitive board games. It does not apply when agents have fundamentally different roles (e.g., offense vs defense in team sports).
`,
      reviewCardIds: ['rc-marl-8.9-3', 'rc-marl-8.9-4'],
      illustrations: [],
    },
    {
      id: 'marl-8.9.3',
      title: 'AlphaZero: Tabula Rasa Learning',
      content: `
**AlphaZero** (Silver et al. 2018) combines self-play MCTS with a deep neural network to learn superhuman game-playing from scratch -- **tabula rasa**, with no human knowledge beyond the rules.

The neural network f(s ; theta) takes a game state as input and outputs two things:

- **u:** a scalar estimating the expected game outcome from state s (win probability from the current player's perspective).
- **p:** a vector of action probabilities, predicting the action distribution that MCTS would compute for state s.

The network is trained by self-play. In each episode, MCTS uses f to evaluate new nodes and guide action selection. After the game ends with outcome z (in {-1, 0, +1}), every state s_t visited during the episode generates a training example (s_t, pi_t, z), where pi_t is the action distribution MCTS computed at s_t. The loss function is:

L(theta) = (z - u)^2 - pi^T log p + c ||theta||^2

The first term trains the value prediction u toward the actual game outcome z. The second term trains the action probabilities p to match the MCTS policy pi. The third term is L2 regularization.

AlphaZero modifies the MCTS action selection to leverage the predicted probabilities p:

a = argmax_a [ Q(s, a) + C(s) * P(s, a) * sqrt(N(s)) / (1 + N(s, a)) ]

where P(s, a) = p_a are the neural network's prior action probabilities. This biases exploration toward actions the network considers promising, making the tree search vastly more efficient than random exploration.

The results are remarkable. AlphaZero trained separate instances for chess (9 hours, 44 million games), shogi (12 hours, 24 million games), and Go (13 days, 140 million games). It defeated the strongest existing programs in each game: 29% wins / 70.6% draws / 0.4% losses against Stockfish in chess, and 84.2% wins against Elmo in shogi. While Stockfish evaluated 60 million positions per second, AlphaZero evaluated only 60 thousand -- but its neural network focused search on the most promising moves.

AlphaZero used the *same algorithm* for all three games, with no game-specific heuristics beyond input/output representation. This universality, combined with superhuman performance, represents one of the most impactful results in AI.
`,
      reviewCardIds: ['rc-marl-8.9-5'],
      illustrations: [],
    },
  ],
  summary: `**Key takeaways:**
- MCTS grows a search tree through simulated play, using UCB-style exploration and backpropagation of value estimates to find strong moves from the current state.
- Self-play uses the same policy for both players via egocentric state transformation, creating an effective training signal without requiring a separate opponent.
- Self-play can be strengthened by occasionally playing against past policy versions, preventing overfitting to the current policy.
- AlphaZero combines self-play MCTS with a deep neural network that predicts both state values and action probabilities, trained purely from game outcomes.
- The network's action probabilities guide MCTS exploration toward promising moves, compensating for evaluating far fewer positions than traditional search engines.
- AlphaZero achieved superhuman performance in chess, shogi, and Go using the same algorithm with no game-specific heuristics -- a landmark "tabula rasa" result.`,
};

export default lesson;
