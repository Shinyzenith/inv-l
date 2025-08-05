.PHONY: all build

all: run

run:
	wasm-pack build -d ../src/components/pkg rs-eval --target web
	npx @tailwindcss/cli -i ./src/index.css -o ./src/tailwind_processed.css
	npm run start
