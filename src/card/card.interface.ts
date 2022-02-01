export interface IAttribute {
  type: string
  value: string | number
}

export interface IMetadataNFT {
  nftId?: number

  factionNumber?: string

  name?: string

  image?: string

  description?: string

  attributes?: IAttribute[]
}

export interface IOpenSeaAttribute {
  trait_type: string
  value: string | number
}

export interface IOpenSeaMetadata {
  attributes?: IOpenSeaAttribute[]
  description?: string
  external_art?: string
  external_thumb?: string
  external_url?: string
  image: string
  name: string
  factionNumber: string
}

export interface IArrayUpdates {
  increment?: IAttribute
  add?: any[]
  remove?: any[]
}
