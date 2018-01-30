import { Address } from './address'
import { LocalAuthority } from './localAuthority'
import { Country } from './country'

export class PostcodeInfoResponse {

  constructor (public readonly valid: boolean,
               public readonly latitude?: number,
               public readonly longitude?: number,
               public readonly localAuthority?: LocalAuthority,
               public readonly country?: Country,
               public readonly addresses?: Address[]) {
  }
}
