
build: 
	@component build

components: component.json 
	@component install

components-dev: component.json
	@component install -d

test: components-dev 
	@component build -d

clean:
	rm -fr build components

.PHONY: clean
