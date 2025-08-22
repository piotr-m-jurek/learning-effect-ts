import { Config, ConfigProvider, Layer } from "effect";


const Testing = Config.nested("POKE_API")(
    Config.all({
        url: Config.string("URL")
    })
)



const LiveConfigProvider = ConfigProvider.fromEnv({seqDelim: "_"})

export const LiveConfigProviderLayer = Layer.setConfigProvider(LiveConfigProvider)

const TestConfigProvider = ConfigProvider.fromMap(
    new Map([["BASE_URL", "http://localhost:3000"]])
);

export const TestConfigProviderLayer = Layer.setConfigProvider(TestConfigProvider)
