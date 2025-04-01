// utility functions for grid layout system

/**
 * Get the control position from a mouse event
 */
export function getControlPosition(e) {
    return offsetXYFromParentOf(e);
}

/**
 * Get the offset position relative to the parent element
 */
export function offsetXYFromParentOf(evt) {
    if (!evt) return { x: 0, y: 0 };

    // Get the target's parent element
    const offsetParent = evt.target.offsetParent || document.body;
    const offsetParentRect = offsetParent === document.body
        ? { left: 0, top: 0 }
        : offsetParent.getBoundingClientRect();

    // Calculate position
    const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
    const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;

    return { x, y };
}

/**
 * Create core data for drag/resize operations
 */
export function createCoreData(lastX, lastY, x, y) {
    const isStart = typeof lastX !== 'number';

    if (isStart) {
        return {
            deltaX: 0,
            deltaY: 0,
            lastX: x,
            lastY: y,
            x,
            y
        };
    }

    return {
        deltaX: x - lastX,
        deltaY: y - lastY,
        lastX,
        lastY,
        x,
        y
    };
}

/**
 * Check if two items on the grid are colliding
 */
export function isColliding(item1, item2) {
    return !(
        item1.x + item1.w <= item2.x ||
        item1.x >= item2.x + item2.w ||
        item1.y + item1.h <= item2.y ||
        item1.y >= item2.y + item2.h
    );
}

/**
 * Find the first position where an item can be placed without collisions
 */
export function findPosition(item, layout, cols) {
    let x = 0, y = 0;
    const itemW = item.w;

    // Keep incrementing y until we find a position without collision
    while (true) {
        let canPlace = true;

        // Try each column at current y
        for (x = 0; x <= cols - itemW; x++) {
            canPlace = true;

            // Check for collision with each existing item
            for (let i = 0; i < layout.length; i++) {
                const existingItem = layout[i];
                if (isColliding({...item, x, y}, existingItem)) {
                    canPlace = false;
                    break;
                }
            }

            if (canPlace) return { x, y };
        }

        // Move to next row if we couldn't place in this one
        y++;
    }
}

/**
 * Compact the layout to eliminate empty spaces
 */
export function compactLayout(layout, cols) {
    // Sort by y position (top to bottom)
    const sorted = [...layout].sort((a, b) => a.y - b.y || a.x - b.x);
    const compacted = [];

    // Process each item
    for (let i = 0; i < sorted.length; i++) {
        const item = { ...sorted[i] };

        // Move item up as far as possible
        let newY = item.y;
        while (newY > 0) {
            let collides = false;

            // Check for collisions if we move up
            for (let j = 0; j < compacted.length; j++) {
                if (isColliding({...item, y: newY - 1}, compacted[j])) {
                    collides = true;
                    break;
                }
            }

            if (collides) break;
            newY--;
        }

        compacted.push({...item, y: newY});
    }

    return compacted;
}