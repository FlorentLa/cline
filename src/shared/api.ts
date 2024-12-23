export type ApiProvider =
	| "anthropic"
	| "openrouter"
	| "bedrock"
	| "bedrock-converse"
	| "vertex"
	| "openai"
	| "ollama"
	| "lmstudio"
	| "gemini"
	| "openai-native"

export interface ApiHandlerOptions {
	apiModelId?: string
	apiKey?: string // anthropic
	anthropicBaseUrl?: string
	openRouterApiKey?: string
	openRouterModelId?: string
	openRouterModelInfo?: ModelInfo
	awsAccessKey?: string
	awsSecretKey?: string
	awsSessionToken?: string
	awsRegion?: string
	awsUseCrossRegionInference?: boolean
	vertexProjectId?: string
	vertexRegion?: string
	openAiBaseUrl?: string
	openAiApiKey?: string
	openAiModelId?: string
	ollamaModelId?: string
	ollamaBaseUrl?: string
	lmStudioModelId?: string
	lmStudioBaseUrl?: string
	geminiApiKey?: string
	openAiNativeApiKey?: string
	azureApiVersion?: string
}

export type ApiConfiguration = ApiHandlerOptions & {
	apiProvider?: ApiProvider
}

// Models

export interface ModelInfo {
	maxTokens?: number
	contextWindow?: number
	supportsImages?: boolean
	supportsComputerUse?: boolean
	supportsStreamingWithTools?: boolean
	supportsInferenceProfile?: boolean // New property
	supportsPromptCache: boolean // this value is hardcoded for now
	inputPrice?: number
	outputPrice?: number
	cacheWritesPrice?: number
	cacheReadsPrice?: number
	description?: string
}

// Anthropic
// https://docs.anthropic.com/en/docs/about-claude/models
export type AnthropicModelId = keyof typeof anthropicModels
export const anthropicDefaultModelId: AnthropicModelId = "claude-3-5-sonnet-20241022"
export const anthropicModels = {
	"claude-3-5-sonnet-20241022": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: true,
		supportsComputerUse: true,
		supportsPromptCache: true,
		inputPrice: 3.0, // $3 per million input tokens
		outputPrice: 15.0, // $15 per million output tokens
		cacheWritesPrice: 3.75, // $3.75 per million tokens
		cacheReadsPrice: 0.3, // $0.30 per million tokens
	},
	"claude-3-5-haiku-20241022": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: false,
		supportsPromptCache: true,
		inputPrice: 1.0,
		outputPrice: 5.0,
		cacheWritesPrice: 1.25,
		cacheReadsPrice: 0.1,
	},
	"claude-3-opus-20240229": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: true,
		inputPrice: 15.0,
		outputPrice: 75.0,
		cacheWritesPrice: 18.75,
		cacheReadsPrice: 1.5,
	},
	"claude-3-haiku-20240307": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: true,
		inputPrice: 0.25,
		outputPrice: 1.25,
		cacheWritesPrice: 0.3,
		cacheReadsPrice: 0.03,
	},
} as const satisfies Record<string, ModelInfo> // as const assertion makes the object deeply readonly

// AWS Bedrock
// https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html
export type BedrockModelId = keyof typeof bedrockModels
export const bedrockDefaultModelId: BedrockModelId = "anthropic.claude-3-5-sonnet-20241022-v2:0"
export const bedrockModels = {
	"anthropic.claude-3-5-sonnet-20241022-v2:0": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: true,
		supportsComputerUse: true,
		supportsPromptCache: false,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"anthropic.claude-3-5-haiku-20241022-v1:0": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: false,
		supportsPromptCache: false,
		inputPrice: 1.0,
		outputPrice: 5.0,
	},
	"anthropic.claude-3-5-sonnet-20240620-v1:0": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"anthropic.claude-3-opus-20240229-v1:0": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 15.0,
		outputPrice: 75.0,
	},
	"anthropic.claude-3-sonnet-20240229-v1:0": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"anthropic.claude-3-haiku-20240307-v1:0": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0.25,
		outputPrice: 1.25,
	},
} as const satisfies Record<string, ModelInfo>

// OpenRouter
// https://openrouter.ai/models?order=newest&supported_parameters=tools
export const openRouterDefaultModelId = "anthropic/claude-3.5-sonnet:beta" // will always exist in openRouterModels
export const openRouterDefaultModelInfo: ModelInfo = {
	maxTokens: 8192,
	contextWindow: 200_000,
	supportsImages: true,
	supportsComputerUse: true,
	supportsPromptCache: true,
	inputPrice: 3.0,
	outputPrice: 15.0,
	cacheWritesPrice: 3.75,
	cacheReadsPrice: 0.3,
	description:
		"The new Claude 3.5 Sonnet delivers better-than-Opus capabilities, faster-than-Sonnet speeds, at the same Sonnet prices. Sonnet is particularly good at:\n\n- Coding: New Sonnet scores ~49% on SWE-Bench Verified, higher than the last best score, and without any fancy prompt scaffolding\n- Data science: Augments human data science expertise; navigates unstructured data while using multiple tools for insights\n- Visual processing: excelling at interpreting charts, graphs, and images, accurately transcribing text to derive insights beyond just the text alone\n- Agentic tasks: exceptional tool use, making it great at agentic tasks (i.e. complex, multi-step problem solving tasks that require engaging with other systems)\n\n#multimodal\n\n_This is a faster endpoint, made available in collaboration with Anthropic, that is self-moderated: response moderation happens on the provider's side instead of OpenRouter's. For requests that pass moderation, it's identical to the [Standard](/anthropic/claude-3.5-sonnet) variant._",
}

// Vertex AI
// https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude
export type VertexModelId = keyof typeof vertexModels
export const vertexDefaultModelId: VertexModelId = "claude-3-5-sonnet-v2@20241022"
export const vertexModels = {
	"claude-3-5-sonnet-v2@20241022": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: true,
		supportsComputerUse: true,
		supportsPromptCache: false,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"claude-3-5-sonnet@20240620": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 3.0,
		outputPrice: 15.0,
	},
	"claude-3-5-haiku@20241022": {
		maxTokens: 8192,
		contextWindow: 200_000,
		supportsImages: false,
		supportsPromptCache: false,
		inputPrice: 1.0,
		outputPrice: 5.0,
	},
	"claude-3-opus@20240229": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 15.0,
		outputPrice: 75.0,
	},
	"claude-3-haiku@20240307": {
		maxTokens: 4096,
		contextWindow: 200_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0.25,
		outputPrice: 1.25,
	},
} as const satisfies Record<string, ModelInfo>

export const openAiModelInfoSaneDefaults: ModelInfo = {
	maxTokens: -1,
	contextWindow: 128_000,
	supportsImages: true,
	supportsPromptCache: false,
	inputPrice: 0,
	outputPrice: 0,
}

// Gemini
// https://ai.google.dev/gemini-api/docs/models/gemini
export type GeminiModelId = keyof typeof geminiModels
export const geminiDefaultModelId: GeminiModelId = "gemini-1.5-flash-002"
export const geminiModels = {
	"gemini-1.5-flash-002": {
		maxTokens: 8192,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
	},
	"gemini-1.5-flash-exp-0827": {
		maxTokens: 8192,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
	},
	"gemini-1.5-flash-8b-exp-0827": {
		maxTokens: 8192,
		contextWindow: 1_048_576,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
	},
	"gemini-1.5-pro-002": {
		maxTokens: 8192,
		contextWindow: 2_097_152,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
	},
	"gemini-1.5-pro-exp-0827": {
		maxTokens: 8192,
		contextWindow: 2_097_152,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0,
		outputPrice: 0,
	},
} as const satisfies Record<string, ModelInfo>

// OpenAI Native
// https://openai.com/api/pricing/
export type OpenAiNativeModelId = keyof typeof openAiNativeModels
export const openAiNativeDefaultModelId: OpenAiNativeModelId = "gpt-4o"
export const openAiNativeModels = {
	// don't support tool use yet
	"o1-preview": {
		maxTokens: 32_768,
		contextWindow: 128_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 15,
		outputPrice: 60,
	},
	"o1-mini": {
		maxTokens: 65_536,
		contextWindow: 128_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 3,
		outputPrice: 12,
	},
	"gpt-4o": {
		maxTokens: 4_096,
		contextWindow: 128_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 5,
		outputPrice: 15,
	},
	"gpt-4o-mini": {
		maxTokens: 16_384,
		contextWindow: 128_000,
		supportsImages: true,
		supportsPromptCache: false,
		inputPrice: 0.15,
		outputPrice: 0.6,
	},
} as const satisfies Record<string, ModelInfo>

// Azure OpenAI
// https://learn.microsoft.com/en-us/azure/ai-services/openai/api-version-deprecation
// https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#api-specs
export const azureOpenAiDefaultApiVersion = "2024-08-01-preview"

// New type for BedrockConverse models
export type BedrockConverseModelId = keyof typeof bedrockConverseModels

// Default model ID for BedrockConverse
export const bedrockConverseDefaultModelId: BedrockConverseModelId = "anthropic.claude-3-5-sonnet-20241022-v2:0"

// BedrockConverse models
export const bedrockConverseModels = {
  // Amazon models (support inference profiles)
  "amazon.nova-pro-v1:0": {
    maxTokens: 5000,
    contextWindow: 300_000,
    supportsImages: true,
    supportsComputerUse: false,
    supportsStreamingWithTools: true,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 0.8,
    outputPrice: 3.2,
  },
  "amazon.nova-lite-v1:0": {
    maxTokens: 5000,
    contextWindow: 300_000,
    supportsImages: true,
    supportsComputerUse: false,
    supportsStreamingWithTools: true,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 0.06,
    outputPrice: 0.24,
  },
  "amazon.nova-micro-v1:0": {
    maxTokens: 4096,
    contextWindow: 128_000,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: true,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 0.035,
    outputPrice: 0.014,
  },

  // Anthropic Claude models (support inference profiles)
  "anthropic.claude-3-5-sonnet-20241022-v2:0": {
    maxTokens: 8192,
    contextWindow: 200_000,
    supportsImages: true,
    supportsComputerUse: true,
    supportsStreamingWithTools: true,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 3.0,
    outputPrice: 15.0,
  },
  "anthropic.claude-3-5-haiku-20241022-v1:0": {
    maxTokens: 8192,
    contextWindow: 200_000,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: true,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 1.0,
    outputPrice: 5.0,
  },
  "anthropic.claude-3-5-sonnet-20240620-v1:0": {
    maxTokens: 8192,
    contextWindow: 200_000,
    supportsImages: true,
    supportsComputerUse: false,
    supportsStreamingWithTools: true,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 3.0,
    outputPrice: 15.0,
  },
  "anthropic.claude-3-opus-20240229-v1:0": {
    maxTokens: 4096,
    contextWindow: 200_000,
    supportsImages: true,
    supportsComputerUse: false,
    supportsStreamingWithTools: true,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 15.0,
    outputPrice: 75.0,
  },
  "anthropic.claude-3-sonnet-20240229-v1:0": {
    maxTokens: 4096,
    contextWindow: 200_000,
    supportsImages: true,
    supportsComputerUse: false,
    supportsStreamingWithTools: true,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 3.0,
    outputPrice: 15.0,
  },
  "anthropic.claude-3-haiku-20240307-v1:0": {
    maxTokens: 4096,
    contextWindow: 200_000,
    supportsImages: true,
    supportsComputerUse: false,
    supportsStreamingWithTools: true,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 0.25,
    outputPrice: 1.25,
  },

  // Mistral models (don't support inference profiles)
  "mistral.mistral-large-2407-v1:0": { // tested ok
    maxTokens: 32768,
    contextWindow: 32768,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: false,
    supportsPromptCache: false,
    inputPrice: 4.0,
    outputPrice: 12.0,
  },
  "mistral.mistral-large-2402-v1:0": { // tested ok
    maxTokens: 32768,
    contextWindow: 32768,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: false,
    supportsPromptCache: false,
    inputPrice: 4.0,
    outputPrice: 12.0,
  },
  "mistral.mistral-small-2402-v1:0": { // tested ok
    maxTokens: 32768,
    contextWindow: 32768,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: false,
    supportsPromptCache: false,
    inputPrice: 1.0,
    outputPrice: 3.0,
  },  
  "mistral.mixtral-8x7b-instruct-v0:1": { // tested ok
    maxTokens: 32768,
    contextWindow: 32768,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: false,
    supportsPromptCache: false,
    inputPrice: 0.45,
    outputPrice: 0.7,
  },
  "mistral.mistral-7b-instruct-v0:2": { // tested ok
    maxTokens: 32768,
    contextWindow: 32768,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: false,
    supportsPromptCache: false,
    inputPrice: 0.2,
    outputPrice: 0.4,
  },

  // Cohere models (don't support inference profiles)
  "cohere.command-r-plus-v1:0": { // tested but got stuck in a loop
    maxTokens: 4096,
    contextWindow: 128000,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: true,
    supportsInferenceProfile: false,
    supportsPromptCache: false,
    inputPrice: 3.0,
    outputPrice: 15.0,
  },
  "cohere.command-r-v1:0": { // tested but got stuck in a loop
    maxTokens: 4096,
    contextWindow: 128000,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: true,
    supportsInferenceProfile: false,
    supportsPromptCache: false,
    inputPrice: 0.5,
    outputPrice: 1.5,
  },

  // Meta Llama 3.1 models (don't support inference profiles)
  "meta.llama3-1-8b-instruct-v1:0": { // tested ok
    maxTokens: 4096,
    contextWindow: 128000,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: false,
    supportsPromptCache: false,
    inputPrice: 0.149,
    outputPrice: 0.149,
  },
  "meta.llama3-1-70b-instruct-v1:0": { // tested ok
    maxTokens: 4096,
    contextWindow: 128000,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: false,
    supportsPromptCache: false,
    inputPrice: 0.799,
    outputPrice: 0.799,
  },
  "meta.llama3-1-405b-instruct-v1:0": { // tested ok
    maxTokens: 4096,
    contextWindow: 128000,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: false,
    supportsPromptCache: false,
    inputPrice: 2.4,
    outputPrice: 2.4,
  },

  // Meta Llama 3.2 models
  "meta.llama3-2-1b-instruct-v1:0": {// tested ok
    maxTokens: 4096,
    contextWindow: 128000,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 0.1,
    outputPrice: 0.1,
  },
  "meta.llama3-2-3b-instruct-v1:0": {// tested ok
    maxTokens: 4096,
    contextWindow: 128000,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 0.2,
    outputPrice: 0.2,
  },
  "meta.llama3-2-11b-instruct-v1:0": { // cannot test
    maxTokens: 4096,
    contextWindow: 128000,
    supportsImages: true,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 0.5,
    outputPrice: 0.5,
  },
  "meta.llama3-2-90b-instruct-v1:0": { // cannot test
    maxTokens: 4096,
    contextWindow: 128000,
    supportsImages: true,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: true,
    supportsPromptCache: false,
    inputPrice: 2.0,
    outputPrice: 2.0,
  },

  // AI21 models (don't support inference profiles)
  "ai21.jamba-1-5-large-v1:0": {// tested ok
    maxTokens: 4096,
    contextWindow: 128000,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: false,
    supportsPromptCache: false,
    inputPrice: 2,
    outputPrice: 8,
  },
  "ai21.jamba-1-5-mini-v1:0": {// tested ok
    maxTokens: 4096,
    contextWindow: 128000,
    supportsImages: false,
    supportsComputerUse: false,
    supportsStreamingWithTools: false,
    supportsInferenceProfile: false,
    supportsPromptCache: false,
    inputPrice: 0.2,
    outputPrice: 0.4,
  },
} as const satisfies Record<string, ModelInfo>
