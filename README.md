# reNFT subgraphs

## Getting Started

First, globally install `graph` binary:

```
yarn global add @graphprotocol/graph-cli
```

> We suggest you use `yarn` instead of `npm`.

This command will install the `graph` binary on your machine. This repo works out of the box for Mac and Linux and has been tested with the following binaries:
- `@graphprotocol/graph-cli/0.49.0 darwin-x64 node-v18.14.2`
- `@graphprotocol/graph-cli/0.49.0 linux-x64 node-v18.16.0`

If you don't have the binary after the installation, you can add it to your path. You can figure out where `yarn` installs global binaries by running:

```
yarn global bin
```

Take this yarn directory and then add to your path:

```
export PATH="$PATH:`yarn global bin`"
```

Consider familiarising yourself with [The Graph FAQ](https://thegraph.com/docs/en/developing/developer-faqs/) as well.

## Installation

This repository is a [yarn workspace](https://classic.yarnpkg.com/lang/en/docs/workspaces/).

To install dependencies, run:

```
yarn install
```

To execute scripts specific to a workspace, you can run:

```
yarn workspace @renft/subgraphs-azrael codegen
```

This would execute the `codegen` script in `subgraphs/azrael`

## Adding RPC urls

To use the subgraphs, you must specify a space-separated list of RPCs to add to the graph node in the .env file.

Each RPC will be tagged with the name of the network, followed by the RPC. Examples of the formatting for RPC urls can be found in `.env.example`. The list of supported networks can be found [here](https://thegraph.com/docs/en/developing/supported-networks/).

## Notes on using Anvil and other local RPCs

This docker compose file uses `host.docker.internal` which allows docker containers to access ports on the host machine. 

When using localhost RPCs, such as [Anvil](https://github.com/foundry-rs/foundry/tree/1e78cabbe7029f13a67cb54590afa969a9518638/anvil), replace `localhost` with `host.docker.internal` before adding the RPC to the .env file. For example, `https://localhost:8545` should become `http://host.docker.internal:8545`.

More info on this topic can be found [here](https://medium.com/@TimvanBaarsen/how-to-connect-to-the-docker-host-from-inside-a-docker-container-112b4c71bc66).

---

To run a local Eth mainnet node with anvil:
```
anvil --fork-url=https://eth-archival-rpc.gateway.pokt.network --fork-block-number=16232800 --chain-id=1 --host 0.0.0.0
```

Anvil will now be running at `http://0.0.0.0:8545`

Then, make sure the `.env` is configured as follows:
```
# .env
RPC_TEXT="mainnet:http://host.docker.internal:8545"
```

## Running the graph node

To start the local graph node, you will need `docker`, `docker-compose`, and `jq`. 

> This repo has been tested with Docker version 23.0.5

Then, run:

```
./scripts/run_node.sh
```

## Deploying a subgraph

> **_NOTE:_**  The node must be running before deploying local subgraphs.

To create a single subgraph, specify the subgraph in the script. Examples:

```
yarn deploy-local:azrael

yarn deploy-local:sylvester-v0
```

To deploy all subgraphs, leave off any parameters to the script:

```
yarn deploy-local
```

## Adding a new subgraph

After adding a new subgraph folder, you will want to add a few scripts to `package.json`.

To connect with the workspace root command to deploy all subgraphs at once, you will need a script called `execute-local-deploy`, which will use `npm-run-all` to call the `codegen`, `create-local`, and `deploy` scripts. Examples of these can be found in other subgraph folders.

Once these scripts are added, complete the script linking process by adding a script in the workspace root `package.json` called `deploy-local:<subgraph_folder_name>`. This script will call the `execute-local-deploy` script that is found in your new subgraph workspace. 

Now all subgraphs can be deployed at once with `yarn deploy-local`.

## Known Issues

> :warning: Indexing with a graph node makes frequent on-chain calls, consider using a private RPC url to avoid throttling.

> :warning: **If you are using Macbook M1**: The graph node docker container has memory issues with Macbook M1. See [here](https://github.com/graphprotocol/graph-node/tree/master/docker#running-graph-node-on-an-macbook-m1) for more details on this.
