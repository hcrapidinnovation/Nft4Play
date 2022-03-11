export interface IAttribute {
  type: string
  value: string
}

export interface IMetadataNFT {
  batchId?: number

  name?: string

  image?: string

  description?: string

  attributes?: IAttribute[]
}

export interface IOpenSeaAttribute {
  trait_type: string
  value: string
}

export interface IOpenSeaMetadata {
  attributes?: IOpenSeaAttribute[]
  description?: string
  external_art?: string
  external_thumb?: string
  external_url?: string
  image: string
  name: string
}

export interface IArrayUpdates {
  add?: any[]
  remove?: any[]
}
