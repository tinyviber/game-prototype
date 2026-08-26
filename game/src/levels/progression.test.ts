import { describe, expect, it } from 'vitest';
import { abilities as l1 } from './level-01/puzzle';
import { abilities as l2 } from './level-02/puzzle';
import { abilities as l3 } from './level-03/puzzle';
import { abilities as l4 } from './level-04/puzzle';

describe('workbench ability growth', () => {
  it('keeps earlier tools available as new tools arrive', () => {
    expect([...l2]).toEqual(expect.arrayContaining([...l1]));
    expect([...l3]).toEqual(expect.arrayContaining([...l2]));
    expect([...l4]).toEqual(expect.arrayContaining([...l3]));
  });
});
