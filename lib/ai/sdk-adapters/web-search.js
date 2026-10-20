// Search configuration for the in-process Claude SDK chat path. Docker agents
// keep their own tool configuration. The SDK owns the HTTP MCP transport.
export const CLAUDE_SEARCH_PROVIDERS = ['parallel', 'native', 'disabled'];

export function claudeSearchOptions(provider = 'parallel') {
  if (!CLAUDE_SEARCH_PROVIDERS.includes(provider)) {
    throw new Error(`Unsupported Claude chat search provider: ${provider}`);
  }
  if (provider === 'native') return {};

  // Prevent an implicit switch to Anthropic search if Parallel is unavailable.
  // Native WebSearch/WebFetch remain available through the explicit native choice.
  const options = { disallowedTools: ['WebSearch', 'WebFetch'] };
  if (provider === 'parallel') {
    options.mcpServers = {
      'parallel-search': {
        type: 'http',
        url: 'https://search.parallel.ai/mcp',
        headers: { 'User-Agent': 'thepopebot (https://github.com/stephengpope/thepopebot)' },
      },
    };
  }
  // No allowedTools override: retain the SDK's permission checks, including plan
  // mode. Optional MCP session_id is left to the host, never shared globally.
  return options;
}
