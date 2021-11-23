# Avoiding Common Attacks

## SWC-103 (Floating pragma)

Specific compiler pragma `0.8.7` used to avoid improper control of contract through its lifespan.

## SWC-106 (Unprotected SELFDESTRUCT Instruction)

Properly limits Access Control of certain functions to `onlyOwner` modifier to prevent unauthorized execution.

## Modifiers Used Only for Validation

All modifiers in contract(s) only validate data with `require` statements.

