# Novatec Kubernetes Grafana Panel Plugin

<!-- TODO consider adding pipelines -->
<!-- [![CircleCI](https://circleci.com/gh/grafana/simple-react-panel.svg?style=svg)](https://circleci.com/gh/grafana/simple-react-panel)
[![David Dependency Status](https://david-dm.org/grafana/simple-react-panel.svg)](https://david-dm.org/grafana/simple-react-panel)
[![David Dev Dependency Status](https://david-dm.org/grafana/simple-react-panel/dev-status.svg)](https://david-dm.org/grafana/simple-react-panel/?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/grafana/simple-react-panel/badge.svg)](https://snyk.io/test/github/grafana/simple-react-panel)
[![Maintainability](https://api.codeclimate.com/v1/badges/1dee2585eb412f913cbb/maintainability)](https://codeclimate.com/github/grafana/simple-react-panel/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1dee2585eb412f913cbb/test_coverage)](https://codeclimate.com/github/grafana/simple-react-panel/test_coverage) -->

This Grafana Panel Plugin is developed for Grafana >=v8.

For more information about panels, refer to the official Grafana documentation on [Panels](https://grafana.com/docs/grafana/latest/features/panels/panels/)

## What is K8S Panel Plugin for?

This Panel Plugin offers a visual representation of a Kubernetes cluster. It also gives quick access to the infrastructure metrics of the cluster and the application metrics of the services running on it.

## Requirement to use this plugin

- Kubernetes cluster
- Prometheus Server that provides metrics from the cluster

## Getting started

0. Download and extract the release to `%installationpath%/Grafana/grafana/plugins`
1. Setup Prometheus Data Source in Grafana
2. Setup Panel in Grafana with following Prometheus Queries

|Queryname|Query|
|--|--|
|namespace_pod_container_info|`kube_pod_container_info`|
|deployment_info|`sum(kube_deployment_labels) by (deployment)`|
|pod_owner|`sum(kube_pod_owner) by (owner_name, pod)`|
|replicaset_owner|`sum(kube_replicaset_owner) by (owner_name, replicaset, namespace)`|

3. Further metrics can be provided using following naming convention</br>
**type**/**name**/**level**
```regex
^(?<type>infrastructure|application)\/(?<name>.*(?=\/))\/(?<level>namespace|pod|container|node)$
```
## Contribute

see [`CONTRIBUTE.md`](CONTRIBUTE.md)
