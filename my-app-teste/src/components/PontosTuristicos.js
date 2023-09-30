import React from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

class PontosTuristicos extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            idPontoTuristico: 0,
            nome: '',
            descricao: '',
            pontosTuristicos: [
                { 'idPontoTuristico': 1, 'nome': 'Teste Nome 1', 'descricao': 'Teste Descrição 1' },
                { 'idPontoTuristico': 2, 'nome': 'Teste Nome 2', 'descricao': 'Teste Descrição 2' }
            ],

            modalAberta: false

            //pontosTuristicos: []
        }
    };

    componentDidMount() {
        this.buscarPontoTuristico();
    };

    componentWillUnmount() {

    };

    buscarPontoTuristico = () => {
        /*fetch("https://localhost:5001/api/pontosTuristicos")
                    .then(resposta => resposta.json())
                    .then(dados => {
                        this.setState({ pontosTuristicos: dados })
                    });*/
    };

    cadastrarPontoTuristico = (pontoTuristico) => {
        fetch("https://localhost:5001/api/pontosTuristicos/",
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pontoTuristico)
            })
            .then(resposta => {
                if (resposta.ok) {
                    this.buscarPontoTuristico();
                } else {
                    alert("Não foi possível adicionar o ponto turístico!")
                }
            });
    };

    carregarDadosPontoTuristico = (idPontoTuristico) => {
        fetch("https://localhost:5001/api/pontosTuristicos/" + idPontoTuristico, { method: 'GET' })
            .then(resposta => resposta.json())
            .then(dado => {
                this.setState({
                    idPontoTuristico: dado.idPontoTuristico,
                    nome: dado.nome,
                    descricao: dado.descricao
                });
                this.abrirModal();
            });
    };

    atualizarPontoTuristico = (pontoTuristico) => {
        fetch("https://localhost:5001/api/pontosTuristicos/" + pontoTuristico.idPontoTuristico,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pontoTuristico)
            })
            .then(resposta => {
                if (resposta.ok) {
                    this.buscarPontoTuristico();
                } else {
                    alert("Não foi possível atualizar o ponto turístico!")
                }
            });
    };

    deletarPontoTuristico = (idPontoTuristico) => {
        if (window.confirm("Deseja realmente excluir ?")) {
            fetch("https://localhost:5001/api/pontosTuristicos/" + idPontoTuristico, { method: 'DELETE' })
                .then(resposta => {
                    if (resposta.ok) {
                        this.buscarPontoTuristico();
                    }
                });
        }
    };

    atualizarNome = (e) => {
        this.setState(
            {
                nome: e.target.value
            }
        );
    };

    atualizarDescricao = (e) => {
        this.setState(
            {
                descricao: e.target.value
            }
        );
    };

    submit = () => {

        if (!this.state.nome) {
            alert("Informe o nome");
            document.getElementById('txtNome').focus();
            return false;
        }

        if (!this.state.descricao) {
            alert("Informe a descrição");
            document.getElementById('txtDescricao').focus();
            return false;
        }

        const pontoTuristico = {
            idPontoTuristico: this.idPontoTuristico,
            nome: this.state.nome,
            descricao: this.state.nome
        }

        if (this.state.idPontoTuristico === 0) {
            this.cadastrarPontoTuristico(pontoTuristico);
        } else {
            this.atualizarPontoTuristico(pontoTuristico);
        }

        this.reset();

        this.fecharModal();
    };

    reset = () => {
        this.setState({
            idPontoTuristico: 0,
            nome: '',
            descricao: ''
        });

        this.abrirModal();
    };

    abrirModal = () => {
        this.setState({
            modalAberta: true
        });
    };

    fecharModal = () => {
        this.setState({
            modalAberta: false
        });
    };

    renderTabela() {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.pontosTuristicos.map((pontoTuristico) =>
                            <tr key={pontoTuristico.idPontoTuristico}>
                                <td>{pontoTuristico.nome}</td>
                                <td>{pontoTuristico.descricao}</td>
                                <td>
                                    <Button variant="secondary" onClick={() => this.carregarDadosPontoTuristico(pontoTuristico.idPontoTuristico)}>Atualizar</Button>
                                    <Button variant="danger" onClick={() => this.deletarPontoTuristico(pontoTuristico.idPontoTuristico)}>Excluir</Button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        )
    }

    render() {
        return (
            <div>

                <Modal show={this.state.modalAberta} onHide={this.fecharModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>DADOS DO PONTO TURÍSTICO</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>

                            <Form.Group className="mb-3">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control id="txtNome" type="text" placeholder="Digite o nome" value={this.state.nome} onChange={this.atualizarNome} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Descrição</Form.Label>
                                <Form.Control id="txtDescricao" type="text" placeholder="Digite a descrição" value={this.state.descricao} onChange={this.atualizarDescricao} required />
                            </Form.Group>

                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.fecharModal}>Fechar</Button>
                        <Button variant="primary" type="submit" onClick={this.submit}>Salvar</Button>
                    </Modal.Footer>
                </Modal>

                <Button variant="warning" type="submit" onClick={this.reset}>Novo</Button>

                {this.renderTabela()}
            </div>
        )
    }
}

export default PontosTuristicos;