#!/bin/bash
declare -a output=(
  "StakeManager"
)
declare -a input=(
  "./node_modules/@hexpayday/stake-manager/artifacts/contracts/StakeManager.sol/StakeManager.json"
)

mkdir -p ./src/types
for i in "${!input[@]}"
do
  # echo "${input[$i]}"
  # echo "./$i.d.ts"
  echo -E "declare const schema: $(cat ${input[$i]}); export default schema;" > ./src/types/${output[$i]}.d.ts
done