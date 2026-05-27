# Workflow

## Commit Frequency
- Changes are committed after each completed task.

## Test Coverage
- Minimum required test code coverage: >80%

## Summary Storage
- Task summaries are recorded in commit messages.

## Principles

### Task-Driven Development
- Every change is tied to a specific task in the track plan.
- Tasks are completed sequentially unless specified otherwise.
- Each task produces a single, focused commit.

### Phase Completion Verification and Checkpointing Protocol
- After each phase in `plan.md` is completed, a verification task must be executed.
- This task validates that all work in the phase is complete, tests pass, and the plan is updated.
- The verification task must be marked as a meta-task in `plan.md` with the format:
  `Conductor - User Manual Verification '<Phase Name>' (Protocol in workflow.md)`
- During this verification, the user must manually confirm the phase is complete before proceeding.
- Upon confirmation, `metadata.json` is updated to reflect the phase as completed.

### Code Quality
- Follow the established style guides in `conductor/code_styleguides/`.
- All code must pass linting (`npm run lint`) before committing.
- TypeScript strict mode must compile without errors.

### Documentation
- Update `spec.md` if requirements change during implementation.
- Update `plan.md` to reflect actual progress (mark tasks as done).
