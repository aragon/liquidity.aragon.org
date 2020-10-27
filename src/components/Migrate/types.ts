export type TokenConversionType = 'ANT'
export type ConversionStage = 'form' | 'signing'
export type ValidationStatus =
  | 'notConnected'
  | 'insufficientBalance'
  | 'noAmount'
  | 'valid'
