import React, { Component } from 'react';

import {Jumbotron, Table, Container, Row, Col, Form, FormGroup, Label, Input, Button} from 'reactstrap'

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      cache: [...Array(8).keys()].map( (i, index) =>  { return (
        {
            endereco: ("000" + index.toString(2)).slice(-3),
            palavras: [...Array(4).keys()].map(i => Math.random().toString(16).substring(7) )
        }
      )}
      ),
      principal:[...Array(256).keys()].map( (i, index) =>  { return (
        {
            endereco: ("00000000" + index.toString(2)).slice(-8),
            palavras: [...Array(1).keys()].map(i => Math.random().toString(16).substring(7) )
        }
      )}
      ),
      estatisticas: {},
      endereco_leitura: '',
      endereco_escrita: '',
      dado: ''
    } 

    this.handleChange = this.handleChange.bind(this)
  }


  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }


  desenho_palavra(palavra){
    return(<th>{palavra}</th>)
  }

  desenho_bloco(bloco){
    return (
        <tr>
            <th>{bloco.endereco}</th>
            {bloco.palavras.map(palavra => this.desenho_palavra(palavra))}
        </tr>
    )
  }

  render() {
    return (
        <Container>
            <Jumbotron>
                <Form>
                	<Row>
	                	<Col/>
	                	<Col md="4">
		                    <FormGroup>
		                        <Input 
		                            type="text" 
		                            name="endereco_leitura" 
		                            placeholder="Endereço" 
		                            value={this.state.endereco_leitura} 
		                            onChange={this.handleChange} 
		                        />
		                    </FormGroup>
		                    <Button>Ler</Button>
	                	</Col>
	                	<Col/>
	                	<Col md="4">
		                    <FormGroup>
		                        <Input 
		                            type="text" 
		                            name="endereco_escrita" 
		                            placeholder="Endereço" 
		                            value={this.state.endereco_escrita} 
		                            onChange={this.handleChange}
		                        />
		                        <Input 
		                            type="text" 
		                            name="dado" 
		                            placeholder="Dado" 
		                            value={this.state.dado} 
		                            onChange={this.handleChange}
		                        />
		                    </FormGroup>
		                    <Button>Escrever</Button>
	                	</Col>
	                	<Col/>
	                </Row>
                </Form>
            </Jumbotron>
            <Row>
                <Col md="8">
                	<Jumbotron>
	                    <h4>Memoria Cache</h4>
	                    <Table>
	                        <thead>
	                            <tr>
	                                <th>Endereço</th>
	                                <th>D0</th>
	                                <th>D1</th>
	                                <th>D2</th>
	                                <th>D3</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                            {this.state.cache.map(bloco => this.desenho_bloco(bloco))}
	                        </tbody>
	                    </Table>
                	</Jumbotron>

                    <Jumbotron>
	                    <h4>Estatísticas</h4>
	                    <Table>
	                        <tbody>
                                <tr><th>Numero de acessos:</th></tr>
                                <tr><th>Numero de acertos:</th></tr>
                                <tr><th>Numero de falhas:</th></tr>
                                <tr><th>Numero de leituras:</th></tr>
                                <tr><th>Numero de escritas:</th></tr>
                                <tr><th>Numero de acertos na leitura:</th></tr>
                                <tr><th>Numero de acertos na escrita:</th></tr>
                                <tr><th>Numero de falhas na leituras:</th></tr>
                                <tr><th>Numero de falhas na escrita:</th></tr>
	                        </tbody>
	                    </Table>
                	</Jumbotron>
                </Col>

                <Col md="4">
                	<Jumbotron>
	                    <h4>Memoria Principal</h4>
	                    <Table>
	                        <thead>
	                            <tr>
	                                <th>Endereço</th>
	                                <th>Dado</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                            {this.state.principal.map(bloco => this.desenho_bloco(bloco))}
	                        </tbody>
	                    </Table>
                	</Jumbotron>
                </Col>
            </Row>
        </Container>
    );
  }
}

export default App;
