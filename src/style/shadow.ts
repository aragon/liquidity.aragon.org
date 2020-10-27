import { rgba } from 'polished'

const shadowTint = '#1a424b'

export const shadowDepth = {
  extraLow: `0px 1px 1px ${rgba(shadowTint, 0.1)}, 0px 1px 10px ${rgba(
    shadowTint,
    0.025
  )}`,
  low: `0px 1px 2px ${rgba(shadowTint, 0.125)}, 0px 2px 20px ${rgba(
    shadowTint,
    0.05
  )}`,
  medium: `0px 2px 4px ${rgba(shadowTint, 0.03)}, 0px 10px 20px ${rgba(
    shadowTint,
    0.06
  )}`,
  high: `0px 5px 10px ${rgba(shadowTint, 0.03)}, 0px 15px 50px ${rgba(
    shadowTint,
    0.08
  )}`,
  overlay: `0px 5px 10px ${rgba(shadowTint, 0.05)}, 0px 5px 50px ${rgba(
    shadowTint,
    0.15
  )}`,
}
