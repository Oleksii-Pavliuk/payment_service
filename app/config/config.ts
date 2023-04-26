import convict, { Schema } from "convict";

interface IConfigSchema {
	env: string;
	port: number;
	redisstring: string;
	consulServiceName: string;
	consulHost: string;
	consulPort: number;
	jaegerHost: string;
	jaegerPort: number;
	ampqhost: string;
	ampqport: number;
}

const config: convict.Config<IConfigSchema> = convict({
	env: {
		doc: "Environoment for application",
		format: ["development", "production", "test"],
		default: "development",
		env: "NODE_ENV",
	},
	port: {
		doc: "The port to bind.",
		format: "port",
		default: null,
		env: "PORT",
		arg: "port",
	},	
	redisstring: {
		doc: "Connection string for redis DB",
		format: String,
		default: null,
		env: "REDIS_STRING",
		arg: "redisstring",
		sensitive: true,
	},
	consulServiceName: {
		doc: "The name by which the service is registered in Consul. If not specified, the service is not registered",
		format: "*",
		default: "payments",
		env: "CONSUL_SERVICE_NAME",
	},
	consulHost: {
		doc: "The host where the Consul server runs",
		format: String,
		default: "consul-client",
		env: "CONSUL_HOST",
		arg: "consulhost"
	},
	consulPort: {
		doc: "The port for the Consul client",
		format: "port",
		default: 8500,
		env: "CONSUL_PORT",
	},	
	jaegerHost: {
		doc: "The host where the Jaeger UI",
		format: String,
		default: "jaeger",
		env: "JAEGER_HOST",
		arg: "jaegerhost"
	},
	jaegerPort: {
		doc: "The port for Jaeger UI",
		format: "port",
		default: 4318,
		env: "JAEGER_PORT",
	},
	amqphost: {
		doc: "host for the amqp broker",
		format: String,
		default: null,
		env: "AMQPHOST",
		arg: "amqphost",
	},
	amqpport: {
		doc: "port for the amqp broker",
		format: "port",
		default: null,
		env: "AMQPPORT",
		arg: "amqpport",
	}
} as unknown as Schema<IConfigSchema>);

const env = config.get("env");
config.loadFile(`./config/${env}.json`);

config.validate({ allowed: "strict" });

export default config;
