/**
 * Lesson 9.1: The Agent-Environment Interface and Implementation
 *
 * Covers: Multi-agent environment interface, PettingZoo parallel/AEC APIs,
 * implementing a training loop
 * Source sections: 10.1, 10.2
 */

import type { LessonContentData } from '../../deep-learning-python/lessons/lesson-1-1';

const lesson: LessonContentData = {
  lessonId: 'marl-9.1',
  title: 'The Agent-Environment Interface and Implementation',
  sections: [
    {
      id: 'marl-9.1.1',
      title: 'The Multi-Agent Environment Interface',
      content: `
Interacting with an environment is the foundation of any MARL implementation. Just as single-agent RL centers on the **Gym** interface with its \`reset()\` and \`step()\` functions, MARL requires the same core loop -- but extended to handle multiple agents acting simultaneously.

The general pattern remains the same: \`reset()\` initializes the environment and returns **initial observations** for each agent, while \`step()\` takes a **joint action** (one action per agent) and returns the next observations, rewards, and a termination flag. The key difference from single-agent RL is that observations, actions, and rewards are now **tuples** indexed by agent.

Consider Level-Based Foraging (LBF) as a concrete example. When you create an LBF environment with \`gym.make("Foraging-8x8-2p-1f-v2")\`, the observation space is a tuple of two \`Box\` spaces (one per agent), each a 15-dimensional vector encoding nearby agents, items, and their levels. The action space is a tuple of two \`Discrete(6)\` spaces, corresponding to the six actions: **up, down, left, right, collect, noop**.

Unfortunately, MARL does not have a single unified interface the way single-agent RL has Gym. Different frameworks -- EPyMARL, Mava, JaxMARL, MARLLib -- each use slightly different conventions. Some return lists, others return dictionaries keyed by agent ID. Some bundle the termination and truncation signals differently. The book's codebase adopts a minimal Gym-like interface and uses **wrappers** to adapt environments that deviate from it.

Regardless of the specific API, every multi-agent interface must convey the same information: the **observation space** (what each agent can see), the **action space** (what each agent can do), and the transition dynamics via \`reset()\` and \`step()\`. Understanding this common structure lets you move between frameworks with minimal friction.
`,
      reviewCardIds: ['rc-marl-9.1-1', 'rc-marl-9.1-2'],
      illustrations: [],
      codeExamples: [
        {
          title: 'Creating and inspecting an LBF environment',
          language: 'python',
          code: `import lbforaging
import gym

env = gym.make("Foraging-8x8-2p-1f-v2")

# Observation space: one Box per agent
print(env.observation_space)
# >> Tuple(Box(..., 15), Box(..., 15))

# Action space: one Discrete per agent
print(env.action_space)
# >> Tuple(Discrete(6), Discrete(6))

# Reset returns observations for each agent
observations = env.reset()

# Step takes a list of actions (one per agent)
actions = [env.action_space[i].sample() for i in range(2)]
next_obs, rewards, done, info = env.step(actions)`,
        },
      ],
    },
    {
      id: 'marl-9.1.2',
      title: 'PettingZoo: Parallel and AEC APIs',
      content: `
**PettingZoo** is the most widely adopted library for unifying multi-agent environment interfaces. It provides two distinct API styles that reflect two fundamental modes of multi-agent interaction: **parallel** and **Agent-Environment-Cycle (AEC)**.

In the **parallel API**, all agents act simultaneously at each time step -- exactly like the Gym-style tuple interface described above. You call \`env.reset()\` and receive a dictionary mapping agent names to observations. You pass a dictionary of actions to \`env.step()\`, and get back dictionaries of observations, rewards, terminations, truncations, and infos. This is the natural fit for **simultaneous-move** environments like LBF, MPE, and SMAC, where all agents choose actions at the same moment.

The **AEC (Agent-Environment-Cycle) API** handles **turn-based** games where agents act sequentially. Instead of passing all actions at once, you iterate through agents one at a time. The environment exposes an \`agent_selection\` attribute indicating whose turn it is. You observe for that agent, select an action, and call \`env.step(action)\` for just that agent. The environment then advances to the next agent. This is essential for games like poker, chess, and Hanabi where the order of play matters and agents may observe the actions of those who moved before them.

PettingZoo also provides **wrappers** to convert between the two APIs. A parallel environment can be wrapped to present an AEC interface (useful for algorithms that process agents sequentially), and vice versa. The library integrates environments from many sources -- Atari games, classic board games, MPE, and continuous control tasks -- all behind a consistent interface.

Choosing the right API depends on your environment's dynamics. If agents act simultaneously and your algorithm processes them in batch (e.g., parameter-sharing IDQN), use the parallel API. If the game is turn-based or your algorithm needs sequential agent processing, use AEC.
`,
      reviewCardIds: ['rc-marl-9.1-3'],
      illustrations: [],
      codeExamples: [
        {
          title: 'PettingZoo Parallel API usage',
          language: 'python',
          code: `from pettingzoo.mpe import simple_spread_v3

# Create a parallel environment
env = simple_spread_v3.parallel_env(N=3, max_cycles=25)
observations, infos = env.reset()

while env.agents:
    # observations is a dict: {"agent_0": obs0, "agent_1": obs1, ...}
    actions = {
        agent: env.action_space(agent).sample()
        for agent in env.agents
    }
    observations, rewards, terminations, truncations, infos = env.step(actions)`,
        },
        {
          title: 'PettingZoo AEC API for turn-based games',
          language: 'python',
          code: `from pettingzoo.classic import texas_holdem_v4

env = texas_holdem_v4.env(render_mode="human")
env.reset()

for agent in env.agent_iter():
    observation, reward, termination, truncation, info = env.last()
    if termination or truncation:
        action = None
    else:
        action = env.action_space(agent).sample()
    env.step(action)`,
        },
      ],
    },
    {
      id: 'marl-9.1.3',
      title: 'Implementing a MARL Training Loop',
      content: `
With the interface understood, we can assemble a complete **MARL training loop**. The structure mirrors single-agent RL but must handle per-agent observations, actions, and network forward passes.

The first implementation decision is the **neural network architecture**. In MARL, you typically create a \`MultiAgentFCNetwork\` that wraps $n$ separate fully connected networks (one per agent), each mapping observations to outputs (Q-values for DQN, logits for policy gradient). The constructor takes lists of input sizes and output sizes, one entry per agent. For LBF with two agents and observation size 15 and 6 actions each, you would pass \`in_sizes=[15, 15]\` and \`out_sizes=[6, 6]\`.

A powerful optimization is **parameter sharing** (Section 9.7.1). When agents are homogeneous -- same observation and action spaces, same role -- you can replace $n$ separate networks with a single shared network. The \`MultiAgentFCNetwork_SharedParameters\` variant does exactly this: it creates one \`nn.Sequential\` and runs all agent inputs through it in parallel using \`torch.jit.fork\`. This dramatically reduces the number of trainable parameters and speeds up learning.

The training loop itself follows a standard pattern: (1) reset the environment to get initial observations, (2) select actions using the current networks (e.g., epsilon-greedy for DQN), (3) step the environment to get next observations, rewards, and done flags, (4) store the transition in a **replay buffer**, and (5) sample a batch from the buffer to compute losses and update network parameters.

For the optimization step, a practical tip is to use a **single centralized optimizer** that encompasses all agent parameters, even if the agents have separate networks. Summing the individual losses into one scalar before calling \`loss.backward()\` and \`optimizer.step()\` is significantly faster than maintaining separate optimizers, because it enables parallelized gradient computation across all agents simultaneously.
`,
      reviewCardIds: ['rc-marl-9.1-4', 'rc-marl-9.1-5'],
      illustrations: [],
      codeExamples: [
        {
          title: 'Multi-agent neural network with parameter sharing',
          language: 'python',
          code: `import torch
from torch import nn
from typing import List

class MultiAgentFCNetwork(nn.Module):
    def __init__(self, in_sizes: List[int], out_sizes: List[int]):
        super().__init__()
        activ = nn.ReLU
        hidden_dims = (64, 64)
        n_agents = len(in_sizes)
        assert n_agents == len(out_sizes)
        self.networks = nn.ModuleList()
        for in_size, out_size in zip(in_sizes, out_sizes):
            network = [
                nn.Linear(in_size, hidden_dims[0]), activ(),
                nn.Linear(hidden_dims[0], hidden_dims[1]), activ(),
                nn.Linear(hidden_dims[1], out_size),
            ]
            self.networks.append(nn.Sequential(*network))

    def forward(self, inputs: List[torch.Tensor]):
        futures = [
            torch.jit.fork(model, inputs[i])
            for i, model in enumerate(self.networks)
        ]
        return [torch.jit.wait(fut) for fut in futures]

# For LBF: 2 agents, obs_size=15, 6 actions each
model = MultiAgentFCNetwork([15, 15], [6, 6])`,
        },
        {
          title: 'Centralized optimizer for all agents',
          language: 'python',
          code: `# Collect all parameters into a single optimizer
params_list = (list(nn_agent1.parameters())
             + list(nn_agent2.parameters()))
common_optimizer = torch.optim.Adam(params_list, lr=3e-4)

# Sum individual agent losses, then do one backward pass
loss = loss_agent1 + loss_agent2
loss.backward()
common_optimizer.step()`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- The multi-agent environment interface extends single-agent Gym with tuple-valued observations, actions, and rewards indexed by agent.
- PettingZoo provides two APIs: the parallel API for simultaneous-move environments and the AEC API for turn-based games.
- Neural networks in MARL are organized as per-agent modules (MultiAgentFCNetwork) or shared-parameter modules when agents are homogeneous.
- Parameter sharing replaces $n$ separate networks with one shared network, dramatically reducing trainable parameters.
- Using a single centralized optimizer that sums all agent losses is significantly faster than maintaining separate optimizers per agent.`,
};

export default lesson;
