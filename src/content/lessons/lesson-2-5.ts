/**
 * Lesson 2.5: Building with PyTorch
 *
 * Covers: Linear classifier in PyTorch, Module class, what makes PyTorch unique
 * Source sections: 3.4.2, 3.4.3
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '2.5',
  title: 'Building with PyTorch',
  sections: [
    {
      id: '2.5.1',
      title: 'A Linear Classifier in Pure PyTorch',
      content: `
Let's rebuild the same linear classifier from lesson 2.3, this time in PyTorch. Using the same synthetic 2D data (two clusters of points), we start by defining our model variables with gradient tracking enabled:

\`\`\`python
import torch

input_dim = 2
output_dim = 1

W = torch.rand(input_dim, output_dim, requires_grad=True)
b = torch.zeros(output_dim, requires_grad=True)
\`\`\`

The model and loss functions are almost identical to the TensorFlow versions -- just swap \`tf.\` for \`torch.\`:

\`\`\`python
def model(inputs):
    return torch.matmul(inputs, W) + b

def mean_squared_error(targets, predictions):
    per_sample_losses = torch.square(targets - predictions)
    return torch.mean(per_sample_losses)
\`\`\`

The training step is where things get interesting. PyTorch's gradient pattern involves several careful steps:

\`\`\`python
learning_rate = 0.1

def training_step(inputs, targets):
    predictions = model(inputs)                      # 1. Forward pass
    loss = mean_squared_error(targets, predictions)   # 2. Compute loss
    loss.backward()                                  # 3. Compute gradients
    with torch.no_grad():                            # 4. Update weights
        W -= W.grad * learning_rate                  #    (no gradient tracking!)
        b -= b.grad * learning_rate
    W.grad = None                                    # 5. Reset gradients
    b.grad = None
    return loss
\`\`\`

Two things to notice here. First, we update weights inside \`torch.no_grad()\` -- this tells PyTorch not to track those operations for gradient computation. The weight update itself isn't something we want to differentiate through. Second, we reset \`.grad\` to \`None\` after each step to prevent gradient accumulation.
`,
      reviewCardIds: ['rc-2.5-1', 'rc-2.5-2'],
      illustrations: ['linear-classifier'],
      codeExamples: [
        {
          title: 'Preparing NumPy data for PyTorch',
          language: 'python',
          code: `import numpy as np
import torch

# Convert NumPy arrays to PyTorch tensors
inputs_np = np.random.randn(2000, 2).astype(np.float32)
targets_np = np.random.randint(0, 2, (2000, 1)).astype(np.float32)

inputs  = torch.from_numpy(inputs_np)
targets = torch.from_numpy(targets_np)
print(inputs.shape, targets.shape)  # torch.Size([2000, 2]) torch.Size([2000, 1])`,
        },
        {
          title: 'Raw training step with torch.no_grad()',
          language: 'python',
          code: `import torch

W = torch.rand(2, 1, requires_grad=True)
b = torch.zeros(1, requires_grad=True)
lr = 0.1

predictions = torch.matmul(inputs, W) + b
loss = torch.mean((targets - predictions) ** 2)
loss.backward()

with torch.no_grad():
    W -= W.grad * lr
    b -= b.grad * lr
W.grad = None
b.grad = None`,
        },
      ],
    },
    {
      id: '2.5.2',
      title: 'The Module Class: A Cleaner Pattern',
      content: `
The raw approach works, but PyTorch offers a much cleaner pattern using \`torch.nn.Module\` and an optimizer. This is how most real PyTorch code is written.

A Module is a class that holds parameters and defines a forward pass:

\`\`\`python
class LinearModel(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.W = torch.nn.Parameter(
            torch.rand(input_dim, output_dim)
        )
        self.b = torch.nn.Parameter(torch.zeros(output_dim))

    def forward(self, inputs):
        return torch.matmul(inputs, self.W) + self.b
\`\`\`

Parameters registered on a Module are automatically tracked. You can retrieve them all with \`.parameters()\`, which is exactly what an optimizer needs:

\`\`\`python
model = LinearModel()
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)
\`\`\`

Now the training step becomes much simpler:

\`\`\`python
def training_step(inputs, targets):
    predictions = model(inputs)                      # Forward pass
    loss = mean_squared_error(targets, predictions)
    loss.backward()                                  # Backward pass
    optimizer.step()                                 # Update weights
    model.zero_grad()                                # Reset gradients
    return loss
\`\`\`

Three lines replace all the manual weight management. The key incantation to memorize is: **\`loss.backward()\` then \`optimizer.step()\` then \`model.zero_grad()\`**. Forgetting \`zero_grad()\` is one of the most common PyTorch bugs -- the gradients from the previous step would accumulate into the next one, leading to erratic training.

The loss, model, and optimizer may seem to communicate through hidden channels. Don't worry about the internal mechanics -- just treat this three-step sequence as the standard PyTorch training ritual.
`,
      reviewCardIds: ['rc-2.5-3', 'rc-2.5-4'],
      illustrations: ['pytorch-module'],
      codeExamples: [
        {
          title: 'Defining a Module with automatic parameter tracking',
          language: 'python',
          code: `import torch

class TwoLayerNet(torch.nn.Module):
    def __init__(self, in_dim, hidden_dim, out_dim):
        super().__init__()
        self.layer1 = torch.nn.Linear(in_dim, hidden_dim)
        self.layer2 = torch.nn.Linear(hidden_dim, out_dim)

    def forward(self, x):
        x = torch.relu(self.layer1(x))
        return self.layer2(x)

net = TwoLayerNet(2, 16, 1)
print(sum(p.numel() for p in net.parameters()))  # Total params`,
        },
        {
          title: 'The standard Module + optimizer training ritual',
          language: 'python',
          code: `import torch

model = TwoLayerNet(2, 16, 1)
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)
loss_fn = torch.nn.MSELoss()

for epoch in range(100):
    preds = model(inputs)
    loss = loss_fn(preds, targets)
    loss.backward()          # 1. Compute gradients
    optimizer.step()         # 2. Update weights
    model.zero_grad()        # 3. Reset gradients`,
        },
      ],
    },
    {
      id: '2.5.3',
      title: 'What Makes PyTorch Unique',
      content: `
Having built the same classifier in both TensorFlow and PyTorch, you can see they solve the same problem with different philosophies. Let's step back and consider PyTorch's strengths and weaknesses.

**PyTorch's strengths:**

1. **Eager-first execution.** While TensorFlow and JAX both support eager mode, PyTorch was *designed* to run eagerly at all times. Most PyTorch users never touch compilation. This means the debugging experience is consistently excellent -- what you write is what runs.

2. **Hugging Face ecosystem.** The popular model-sharing platform Hugging Face has first-class PyTorch support. If you want to use a pretrained language model, vision model, or any of the latest generative AI models, they're almost certainly available in PyTorch first. This ecosystem advantage is the primary driver of PyTorch adoption today.

**PyTorch's weaknesses:**

1. **Speed.** Due to its eager execution focus, PyTorch is the slowest of the major frameworks by a significant margin. JAX can be 20-30% faster for typical models, and for large models, the gap can be 3-5x. The \`torch.compile()\` tool helps, but it's still relatively new and doesn't always work.

2. **API inconsistencies.** Like TensorFlow, PyTorch's API sometimes diverges from NumPy. Worse, it's internally inconsistent -- the keyword \`axis\` is sometimes called \`dim\`, some random functions take a \`seed\` argument while others don't, and so on. This makes the learning curve steeper than it needs to be.

3. **Production deployment.** While PyTorch has improved its deployment story with tools like TorchServe and TorchScript, TensorFlow's production ecosystem (TFX, TF-Serving, TFLite) remains more mature.

The bottom line: **PyTorch is the first choice for research and rapid prototyping**, thanks to its Pythonic feel and Hugging Face access. If you're exploring new model architectures or fine-tuning a pretrained model, PyTorch is often the path of least resistance. For production deployment at scale, TensorFlow or JAX may serve you better.
`,
      reviewCardIds: ['rc-2.5-5', 'rc-2.5-6'],
      illustrations: ['tf-vs-pytorch'],
      codeExamples: [
        {
          title: 'Loading a pretrained model from Hugging Face',
          language: 'python',
          code: `from transformers import AutoModel, AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

tokens = tokenizer("Hello, deep learning!", return_tensors="pt")
output = model(**tokens)
print(output.last_hidden_state.shape)  # (1, 6, 768)`,
        },
        {
          title: 'Using DataLoader for batched training',
          language: 'python',
          code: `from torch.utils.data import TensorDataset, DataLoader

dataset = TensorDataset(inputs, targets)
loader = DataLoader(dataset, batch_size=32, shuffle=True)

for batch_x, batch_y in loader:
    print(batch_x.shape)  # torch.Size([32, 2])
    break  # Just show one batch`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- The raw PyTorch training loop: forward pass, \`loss.backward()\`, update weights in \`torch.no_grad()\`, reset gradients.
- The Module + optimizer pattern is cleaner: \`loss.backward()\`, \`optimizer.step()\`, \`model.zero_grad()\`.
- Forgetting \`zero_grad()\` is a common bug that causes gradient accumulation.
- PyTorch's strengths: eager-first debugging, Hugging Face ecosystem access.
- PyTorch's weaknesses: slower execution speed, API inconsistencies, less mature production deployment.
- PyTorch is ideal for research and prototyping; TF or JAX may be better for production at scale.`,
};

export default lesson;
