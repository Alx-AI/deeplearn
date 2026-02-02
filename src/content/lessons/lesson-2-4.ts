/**
 * Lesson 2.4: First Steps with PyTorch
 *
 * Covers: PyTorch basics, tensors, parameters, autograd, dynamic computation
 * Source sections: 3.4.1
 */

import { LessonContentData } from './lesson-1-1';

const lesson: LessonContentData = {
  lessonId: '2.4',
  title: 'First Steps with PyTorch',
  sections: [
    {
      id: '2.4.1',
      title: 'Tensors and Parameters in PyTorch',
      content: `
PyTorch is Meta's open source framework, and it has become the most popular choice in the machine learning research community. Its design philosophy centers on feeling like "normal Python" -- you write code, it runs immediately, and you can inspect everything along the way.

A quick heads-up: the package isn't called \`pytorch\`. It's called \`torch\`. You install it with \`pip install torch\` and import it with \`import torch\`.

Creating tensors looks similar to TensorFlow and NumPy, but with some syntax quirks:

\`\`\`python
import torch

torch.ones(size=(2, 1))             # Note: "size" not "shape"
torch.zeros(size=(2, 1))
torch.tensor([1, 2, 3], dtype=torch.float32)  # dtype must be a torch type

# Random tensors -- syntax differs from NumPy/TF
torch.normal(
    mean=torch.zeros(size=(3, 1)),
    std=torch.ones(size=(3, 1))
)
torch.rand(3, 1)   # Uniform [0, 1), dimensions as separate args
\`\`\`

One major difference from TensorFlow: **PyTorch tensors are mutable.** You can assign to elements directly:

\`\`\`python
x = torch.zeros(size=(2, 1))
x[0, 0] = 1.0   # This works! (Would fail in TensorFlow)
\`\`\`

For trainable model state, PyTorch provides \`torch.nn.parameter.Parameter\`, a specialized tensor subclass. While you *could* just use regular tensors with \`requires_grad=True\`, Parameters provide semantic clarity -- when you see a Parameter, you know it's a learnable weight. PyTorch also automatically tracks Parameters assigned to model classes, similar to how Keras tracks Variables:

\`\`\`python
x = torch.zeros(size=(2, 1))
p = torch.nn.parameter.Parameter(data=x)
\`\`\`

The mutable-by-default design is part of PyTorch's philosophy: minimal surprises for Python programmers. If it looks like a Python array operation, it should work like one.
`,
      reviewCardIds: ['rc-2.4-1', 'rc-2.4-2'],
      illustrations: ['tf-vs-pytorch'],
      codeExamples: [
        {
          title: 'Tensor creation and dtype inspection',
          language: 'python',
          code: `import torch

x = torch.tensor([1.0, 2.0, 3.0])
print(x.shape)   # torch.Size([3])
print(x.dtype)   # torch.float32
print(x.device)  # cpu (or cuda:0 on GPU)`,
        },
        {
          title: 'Mutable tensors vs Parameter',
          language: 'python',
          code: `import torch

x = torch.zeros(2, 3)
x[0, 0] = 99.0  # Mutation works on regular tensors

# Parameter wraps a tensor for use as a learnable weight
p = torch.nn.Parameter(torch.randn(2, 3))
print(p.requires_grad)  # True (always)`,
        },
        {
          title: 'Moving tensors to GPU',
          language: 'python',
          code: `import torch

x = torch.randn(3, 3)
if torch.cuda.is_available():
    x = x.to("cuda")       # Move to GPU
    print(x.device)         # cuda:0
    x = x.to("cpu")        # Move back to CPU`,
        },
      ],
    },
    {
      id: '2.4.2',
      title: 'Operations and Gradients with backward()',
      content: `
Math in PyTorch works very similarly to NumPy and TensorFlow:

\`\`\`python
a = torch.ones((2, 2))
b = torch.square(a)        # element-wise square
c = torch.sqrt(a)          # element-wise square root
d = b + c                  # addition
e = torch.matmul(a, b)     # matrix multiplication
f = torch.cat((a, b), dim=0)  # concatenation (note: "dim" not "axis")
\`\`\`

Small gotcha: PyTorch uses \`dim\` where NumPy and TensorFlow use \`axis\`. This inconsistency can be confusing but becomes second nature with practice.

Now for gradients. PyTorch takes a different approach from TensorFlow's explicit GradientTape. There's no visible "tape" -- instead, PyTorch silently builds a computation graph as operations execute. You trigger gradient computation by calling \`.backward()\` on the output tensor:

\`\`\`python
input_var = torch.tensor(3.0, requires_grad=True)
result = torch.square(input_var)
result.backward()                    # Compute gradients
gradient = input_var.grad            # Access the gradient
# gradient is tensor(6.) -- derivative of x^2 at x=3
\`\`\`

The key difference from TensorFlow: **gradients accumulate by default.** If you call \`.backward()\` twice without resetting, the gradients add up:

\`\`\`python
result = torch.square(input_var)
result.backward()
print(input_var.grad)  # tensor(12.) -- doubled! Not what you want.
\`\`\`

To prevent this, you must reset gradients between training steps:

\`\`\`python
input_var.grad = None   # Reset before next backward pass
\`\`\`

This is a common source of bugs for PyTorch beginners. TensorFlow avoids this issue because GradientTape computes fresh gradients each time. In PyTorch, **always remember to zero out your gradients**.
`,
      reviewCardIds: ['rc-2.4-3', 'rc-2.4-4', 'rc-2.4-5'],
      illustrations: ['gradient-tape-flow'],
      codeExamples: [
        {
          title: 'Full gradient computation cycle',
          language: 'python',
          code: `import torch

x = torch.tensor(3.0, requires_grad=True)
y = x ** 2 + 2 * x + 1   # y = x^2 + 2x + 1
y.backward()               # dy/dx = 2x + 2
print(x.grad)              # tensor(8.)  (at x=3)

x.grad = None              # Reset before next computation
z = x ** 3
z.backward()
print(x.grad)              # tensor(27.) (3*x^2 at x=3)`,
        },
        {
          title: 'Gradient accumulation bug (and the fix)',
          language: 'python',
          code: `import torch

x = torch.tensor(2.0, requires_grad=True)
for i in range(3):
    y = x ** 2
    y.backward()
    print(f"Step {i}: grad = {x.grad}")
    x.grad = None   # Remove this line to see the bug!
# Step 0: grad = 4.0
# Step 1: grad = 4.0
# Step 2: grad = 4.0`,
        },
      ],
    },
    {
      id: '2.4.3',
      title: 'Dynamic Computation and Eager Execution',
      content: `
PyTorch's defining characteristic is its commitment to **eager execution by default**. Every operation runs immediately when you call it, just like normal Python. There's no graph to build, no session to create, no compilation step to worry about.

This makes debugging a breeze. You can:
- Insert \`print()\` statements anywhere to inspect tensor values
- Use Python's standard debugger (\`pdb\`) to step through your model
- Use regular \`if/else\` statements and \`for\` loops that depend on tensor values at runtime

This "dynamic computation graph" approach (inherited from the Chainer framework) is what originally attracted the research community to PyTorch. When you're experimenting with novel architectures, being able to print, inspect, and branch freely is invaluable.

PyTorch does offer a compilation tool called \`torch.compile()\`:

\`\`\`python
compiled_model = torch.compile(model)

# Or as a decorator:
@torch.compile
def dense(inputs, W, b):
    return torch.nn.relu(torch.matmul(inputs, W) + b)
\`\`\`

However, in practice, most PyTorch code runs without compilation. The PyTorch compiler (Dynamo) is a relatively recent addition and doesn't always work with every model or produce a speedup. This is one reason PyTorch tends to be the slowest of the three major frameworks.

The tradeoff is clear: **PyTorch prioritizes developer experience over raw speed.** For research and prototyping where you need to iterate quickly and debug freely, that's often the right call. For production systems processing millions of requests, you might want the compilation story offered by TensorFlow or JAX.

A helpful analogy: TensorFlow is like writing a recipe and then handing it to a chef (the graph) to execute. PyTorch is like cooking the meal yourself, step by step, tasting as you go. The second approach is more flexible and easier to adjust, but the first can be more efficient for large-scale production.
`,
      reviewCardIds: ['rc-2.4-6', 'rc-2.4-7'],
      codeExamples: [
        {
          title: 'Debugging with print inside a model',
          language: 'python',
          code: `import torch

def debug_forward(x, W, b):
    z = torch.matmul(x, W) + b
    print(f"Pre-activation stats: mean={z.mean():.3f}, std={z.std():.3f}")
    return torch.relu(z)

W = torch.randn(4, 3)
b = torch.zeros(3)
out = debug_forward(torch.randn(2, 4), W, b)`,
        },
        {
          title: 'Using torch.compile for speed',
          language: 'python',
          code: `import torch

def my_function(x):
    return torch.sin(x) ** 2 + torch.cos(x) ** 2

# Compile for optimized execution
compiled_fn = torch.compile(my_function)
x = torch.randn(1000)
result = compiled_fn(x)  # ~1.0 everywhere (trig identity)`,
        },
      ],
    },
  ],
  summary: `**Key takeaways:**
- PyTorch tensors are mutable (unlike TensorFlow). Use \`torch.nn.Parameter\` for learnable weights.
- Gradients are computed via \`.backward()\` and stored in \`.grad\` -- but they accumulate by default, so always reset with \`.grad = None\`.
- PyTorch uses eager execution by default, making it feel like normal Python and easy to debug.
- \`torch.compile()\` exists but is optional and not yet widely adopted.
- PyTorch prioritizes developer experience over raw speed; it's the go-to for research and prototyping.
- Watch for syntax differences: \`size\` vs \`shape\`, \`dim\` vs \`axis\`, torch dtypes instead of strings.`,
};

export default lesson;
