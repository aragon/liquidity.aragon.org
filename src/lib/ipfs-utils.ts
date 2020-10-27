// @ts-ignore
import isIPFS from 'is-ipfs'
import { networkEnvironment } from '../environment'

export async function ipfsGet(
  cid: string
): Promise<{
  data?: string
  error: boolean
}> {
  const { ipfsGateway } = networkEnvironment
  const endpoint = `${ipfsGateway}/${cid}`

  try {
    const result = await fetch(endpoint)
    const data = await result.text()

    return { data, error: !result.ok }
  } catch (err) {
    console.error(`Error requesting data from IPFS for ${endpoint}`, err)
    return { error: true }
  }
}

export function getIpfsCidFromUri(uri: string): string {
  const ipfsCid = uri.replace(/^ipfs:/, '')

  if (isIPFS.cid(ipfsCid) || isIPFS.cidPath(ipfsCid)) {
    return ipfsCid
  }
  return ''
}

export function getIpfsUrlFromUri(uri: string): string {
  const { ipfsGateway } = networkEnvironment
  return `${ipfsGateway}/${getIpfsCidFromUri(uri)}`
}
