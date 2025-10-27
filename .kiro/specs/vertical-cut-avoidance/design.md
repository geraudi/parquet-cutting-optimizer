# Design Document

## Overview

The vertical cut avoidance feature enhances the existing parquet cutting optimizer by adding constraints to prevent cuts from aligning vertically between adjacent rows. This design integrates seamlessly with the current algorithm while maintaining all existing functionality and constraints.

The solution introduces a cut position tracking system that monitors where cuts occur in each row and uses this information to influence strip selection in subsequent rows. When a potential cut would create vertical alignment, the algorithm explores alternative strip arrangements to maintain the required offset distance.

## Architecture

### Core Components

1. **Cut Position Tracker**: Tracks cut positions within each row to enable vertical alignment detection
2. **Enhanced Strip Selection**: Modified strip selection logic that considers cut positions from previous rows
3. **Validation System**: Post-calculation validation to ensure cut avoidance constraints are met
4. **Configuration Interface**: Configurable minimum offset distance parameter

### Integration Points

The feature integrates with existing components:
- `getRoomStripes()`: Enhanced to track and avoid vertical cut alignment
- `getRandomStrip()`: Modified to consider cut avoidance constraints
- `isValidStrip()`: Extended validation logic for cut positioning
- `calculate()`: Updated interface to accept cut avoidance configuration

## Components and Interfaces

### Enhanced Configuration Interface

```typescript
export interface CutAvoidanceConfig {
  minCutOffset: number; // Minimum distance between vertically aligned cuts (default: 30)
  enabled: boolean; // Enable/disable cut avoidance (default: true)
}

export interface CalculationOptions {
  cutAvoidance?: CutAvoidanceConfig;
}
```

### Cut Position Tracking

```typescript
interface CutPosition {
  position: number; // Distance from row start where cut occurs
  rowIndex: number; // Row index for reference
}

interface RowCutInfo {
  rowIndex: number;
  cutPositions: number[]; // Array of cut positions in this row
}
```

### Enhanced Strip Selection

The `getRandomStrip()` function will be enhanced to accept cut avoidance parameters:

```typescript
function getRandomStrip(
  min: number,
  max: number,
  strips: Strip[],
  isFirst: boolean,
  cutAvoidanceContext?: CutAvoidanceContext
): Strip
```

### Cut Avoidance Context

```typescript
interface CutAvoidanceContext {
  previousRowCuts: number[]; // Cut positions from previous row
  currentPosition: number; // Current position in the row being built
  minOffset: number; // Minimum required offset distance
  roomWidth: number; // Total room width for calculations
}
```

## Data Models

### Enhanced Row Interface

```typescript
export interface Row {
  id: string;
  strips: Strip[];
  cutPositions?: number[]; // Optional: positions where cuts occur in this row
}
```

### Validation Result

```typescript
interface CutValidationResult {
  isValid: boolean;
  violations: CutViolation[];
  metadata: {
    totalCuts: number;
    averageOffset: number;
    minObservedOffset: number;
  };
}

interface CutViolation {
  rowIndex: number;
  cutPosition: number;
  conflictingRowIndex: number;
  conflictingCutPosition: number;
  actualOffset: number;
  requiredOffset: number;
}
```

## Algorithm Design

### Cut Position Calculation

For each row, calculate cut positions by accumulating strip widths:

1. Initialize position counter at 0
2. For each strip in the row:
   - Add strip width to position counter
   - If strip is cut, record the cut position
3. Store cut positions for use in subsequent rows

### Enhanced Strip Selection Logic

When selecting strips for a new row:

1. Get cut positions from the previous row
2. Calculate current position in the row being built
3. For each candidate strip:
   - Calculate where a potential cut would occur
   - Check if cut position conflicts with previous row cuts
   - If conflict exists, try alternative strips
   - If no alternatives exist, allow conflict but log warning

### Conflict Detection Algorithm

```typescript
function wouldCreateVerticalAlignment(
  currentPosition: number,
  stripWidth: number,
  roomWidth: number,
  previousCuts: number[],
  minOffset: number
): boolean {
  const potentialCutPosition = currentPosition + stripWidth;
  
  // Only check if this strip would be cut
  if (potentialCutPosition <= roomWidth) {
    return false; // No cut needed, no conflict possible
  }
  
  const actualCutPosition = roomWidth;
  
  return previousCuts.some(prevCut => 
    Math.abs(actualCutPosition - prevCut) < minOffset
  );
}
```

## Error Handling

### Graceful Degradation

1. **Primary Strategy**: Attempt to find strips that avoid vertical alignment
2. **Fallback Strategy**: If no valid arrangement exists after reasonable attempts, allow alignment but log warning
3. **Error Recovery**: Maintain existing retry mechanism for cases where no solution exists

### Warning System

```typescript
interface CalculationWarnings {
  cutAlignmentViolations: CutViolation[];
  fallbacksUsed: number;
  retryCount: number;
}
```

### Error Types

- `CutAvoidanceImpossibleError`: When constraints cannot be satisfied
- `ConfigurationError`: When invalid cut avoidance parameters are provided

## Testing Strategy

### Unit Tests

1. **Cut Position Calculation**: Verify accurate tracking of cut positions within rows
2. **Conflict Detection**: Test vertical alignment detection logic with various scenarios
3. **Strip Selection**: Validate enhanced strip selection considers cut avoidance
4. **Configuration Handling**: Test parameter validation and default values

### Integration Tests

1. **End-to-End Scenarios**: Complete room calculations with cut avoidance enabled
2. **Constraint Interaction**: Verify cut avoidance works with existing constraints
3. **Fallback Behavior**: Test graceful degradation when constraints cannot be met
4. **Performance Impact**: Ensure acceptable performance with additional constraints

### Test Scenarios

1. **Simple Case**: Two rows with potential vertical alignment
2. **Multiple Conflicts**: Row with multiple cuts conflicting with previous row
3. **Edge Cases**: Minimum room width, maximum strip lengths
4. **Configuration Variants**: Different minimum offset values
5. **Stress Testing**: Large rooms with many rows and complex cut patterns

### Validation Tests

1. **Post-Calculation Validation**: Verify no vertical alignments exist in results
2. **Constraint Compliance**: Ensure all existing constraints still satisfied
3. **Metadata Accuracy**: Validate cut position tracking and reporting

## Performance Considerations

### Computational Complexity

- Cut position tracking: O(n) per row where n is strips per row
- Conflict detection: O(m) per strip selection where m is cuts in previous row
- Overall impact: Minimal increase in computational complexity

### Memory Usage

- Additional storage for cut positions per row
- Temporary storage for cut avoidance context during calculation
- Estimated memory increase: <5% for typical room sizes

### Optimization Opportunities

1. **Caching**: Cache conflict detection results for repeated strip combinations
2. **Early Termination**: Skip conflict checking when no cuts exist in previous row
3. **Heuristic Ordering**: Prioritize strips less likely to create conflicts