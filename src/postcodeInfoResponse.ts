import { Address } from './address'
import { LocalAuthority } from './localAuthority'

export class PostcodeInfoResponse {

  constructor (public readonly valid: boolean,
               public readonly latitude?: number,
               public readonly longitude?: number,
               public readonly localAuthority?: LocalAuthority,
               public readonly country?: string,
               public readonly addresses?: Address[]) {
  }
}
