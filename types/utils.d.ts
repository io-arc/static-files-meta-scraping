// Config file name
type TConfigFile = string

// Search target
type TSearch = {
  // like CSS property
  target: string
  // Target property (If get tag content to, set empty)
  value?: string
}

// Config file data
interface IfConfigFile {
  search: TSearch[]
  ext?: string
  dir?: string
}

// TODO: 検索結果
interface IfSearchResult {
  filename: string
  type: 'html' | 'css'
  data: { key: string; value: string; image?: string | null }[]
}