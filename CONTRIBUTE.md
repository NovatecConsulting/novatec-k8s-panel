## Setup panel

1. clone the plugin to `%installationpath%/Grafana/grafana/plugins`
2. Install dependencies `npm i`
3. Build project `yarn build`

## Setup demo env with minikube and (altered) sockshop

### Minikube

```
minikube start --memory 8192 --cpus 4 --no-vtx-check
```

#### Prometheus

```BASH
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add kube-state-metrics https://kubernetes.github.io/kube-state-metrics
helm repo update
helm install [RELEASE_NAME] prometheus-community/Prometheus
```

#### cAdvisor
```BASH
helm repo add ckotzbauer https://ckotzbauer.github.io/helm-charts
helm install my-cadvisor ckotzbauer/cadvisor --version 1.2.4
```

#### Sockshop

1. clone [Sock Shop](https://github.com/microservices-demo/microservices-demo)
2. replace `%installationpath%Sockshop/microservices-demo/deploy/kubernetes/complete-demo.yaml` with `%installationpath%/novatec-k8s-panel/complete-demo.yaml`. You can find the [images on docker hub](https://hub.docker.com/u/thesisphilip). You might need to add them manually.
3. Setup Sockshop
```BASH
cd %installationpath%/Sockshop/microservices-demo/deploy/kubernetes
kubectl create namespace sock-shop
kubectl apply -f complete-demo.yaml
```

## Learn more about Grafana Plugins
- [Build a panel plugin tutorial](https://grafana.com/tutorials/build-a-panel-plugin)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the most of Grafana
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana Design System
"# Thesis" 