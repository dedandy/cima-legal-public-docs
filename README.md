# cima-legal-public-docs

Repository pubblico dei documenti legali canonicali consumati dalle altre applicazioni.

## Struttura

```text
legal-docs/
  manifests/latest.json
  manifests/history/
  documents/
```

## Workflow
- Le modifiche arrivano dal publisher BE tramite branch + pull request.
- Le PR eseguono validazione schema/naming del manifest.
- Su merge in `main`, viene normalizzato il manifest e possono essere pubblicati artefatti/pagine.

## Comandi
- `npm run validate:legal-docs`
- `npm run build:manifest`
