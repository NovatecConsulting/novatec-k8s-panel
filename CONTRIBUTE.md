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

## Unit Tests

To create a test suite jest testing library provides a function called describe in which two parameters have to be inserted, the first one accepts a string to name the test suite, and the second is a callback function that includes all the tests inside

```
describe("GraphUI component tests", () => {
  ...
})
```

### 1. Component Test

inside the function called 'it' or 'test', there's two parametes:

- first parameter accepts a string: there we can write what would the test do
- second parameter accepts a callback function in which we run the test.

#### a. Component renders without crashing

- in this test we create a dom elemennt to render the component inside
- using the render function of the reactDOM library, we pass the component as the first parameter and the created container as a second parameter.
- we specify the props of the components either manually or by using a mocking function (mocking function are explained below).

```
it('component renders without crashing', () => {
        render(<GraphUI {...props} />);
    })
```

Note: for typescript tests , all the component props have to be specified. amd for this case we would need mocking.

#### b. Mocking modules/components/functions

- in some components there is depndencies/libraries or external components that we don't need/want to test, since they might cause external problems and latencies. so we need to mock them. grafana offers some built-in mocking function for functions and dependencies. you can see the grafana documentation or the grafana github repository.
- you can manually mock a function b using the mock fuction of jest , in which you pass a string of the mocked object , and an arrow function. EX:

  ```
  jest.mock('grafana/ui', ()=>{

  })
  ```

  PS: if a component is using useTheme2() from '@grafana/ui' , useTheme2 function has to be mocked.

#### c. Component renders correctly

In this test we see if the component have renders his elements and functionality correctly.

##### - Elements testing

Here the DOM elements inside the component are tested. to do that we need to assign the elements inside the components 'data-testid' in this way we can identify the tested elements.

```

<Button data-testid="graphUI-button" ... > Back </Button>

```

To test the state of the elements, jest provides a list of functions to
test if the value expected and the value written are the same.
If the expected value and the received value are the same, the test iis passes. else the test fails.

```

expect(getByTestId("graphUI-button").textContent).toBe("Back");

```

##### - Event testing

Here is the behavior of the Dom elements inside the compononet tested. here provide the react testing library a function called 'fireEvent' and this one would fire an event of a specific given element ( usually used along with getBytestId function)

```

fireEvent.click(button);

```

After firing the event, we test the state of the elements like it's done in the previous test.

```

expect(button.textContent).toContain("Back");
expect(graphUI).not.toBeFalsy;

```

## Learn more about Grafana Plugins

- [Build a panel plugin tutorial](https://grafana.com/tutorials/build-a-panel-plugin)
- [Grafana documentation](https://grafana.com/docs/)
- [Grafana Tutorials](https://grafana.com/tutorials/) - Grafana Tutorials are step-by-step guides that help you make the most of Grafana
- [Grafana UI Library](https://developers.grafana.com/ui) - UI components to help you build interfaces using Grafana Design System
