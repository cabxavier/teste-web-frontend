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
            idCidade: 0,
            referencia: '',
            pontosTuristicos: [],
            estados: [],
            cidades: [],
            modalAberta: false
        }
    };

    componentDidMount() {
        this.buscarPontoTuristico();
    };

    componentWillUnmount() {

    };

    buscarEstados = () => {
        fetch("http://localhost:54303/api/estados")
            .then(resposta => resposta.json())
            .then(dados => {
                this.setState({ estados: dados, cidades: [] })
            });
    };

    buscarCidades = (idEstado) => {
        fetch("http://localhost:54303/api/estados/" + idEstado + "/cidades")
            .then(resposta => resposta.json())
            .then(dados => {
                this.setState({ cidades: dados })
            });
    };

    buscarPontoTuristico = () => {
        fetch("http://localhost:54303/api/pontos-turisticos")
            .then(resposta => resposta.json())
            .then(dados => {
                this.setState({ pontosTuristicos: dados })
            });
    };

    cadastrarPontoTuristico = (pontoTuristico) => {
        fetch("http://localhost:54303/api/pontos-turisticos/novo",
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pontoTuristico)
            })
            .then(resposta => {
                if (!resposta.ok) {
                    alert("Não foi possível cadastrar o ponto turístico! Error:" + resposta.statusText);
                }
                this.buscarPontoTuristico();
            });
    };

    carregarDadosPontoTuristico = (idPontoTuristico) => {
        fetch("https://localhost:5001/api/pontosTuristicos/" + idPontoTuristico, { method: 'GET' })
            .then(resposta => resposta.json())
            .then(dado => {
                this.setState({
                    idPontoTuristico: dado.idPontoTuristico,
                    nome: dado.nome,
                    descricao: dado.descricao,
                    referencia: dado.referencia
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
                    alert("Não foi possível atualizar o ponto turístico! " + resposta.internalServerError)
                }
            });
    };

    deletarPontoTuristico = (idPontoTuristico) => {
        if (window.confirm("Deseja realmente excluir ?")) {
            fetch("http://localhost:54303/api/pontos-turisticos/" + idPontoTuristico + "/excluir", { method: 'DELETE' })
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

    atualizarReferencia = (e) => {
        this.setState(
            {
                referencia: e.target.value
            }
        );
    };

    pegarIdEstado = (e) => {
        this.buscarCidades(e.target.value);
    }

    pegarIdCidade = (e) => {
        this.setState(
            {
                idCidade: e.target.value
            }
        );
    }

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
            descricao: this.state.descricao,
            idCidade: this.state.idCidade,
            referencia: this.state.referencia,
            dataIncluscao: ''
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
            descricao: '',
            referencia: ''
        });

        this.buscarEstados();

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
                        <th>Cidade</th>
                        <th>Estado</th>
                        <th>Referência</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.pontosTuristicos.map((pontoTuristico) =>
                            <tr key={pontoTuristico.idPontoTuristico}>
                                <td>{pontoTuristico.nome}</td>
                                <td>{pontoTuristico.descricao}</td>
                                <td>{pontoTuristico.cidade}</td>
                                <td>{pontoTuristico.estado}</td>
                                <td>{pontoTuristico.referencia}</td>
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

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="estado">Estado</Form.Label>
                                <select id="estado" onChange={this.pegarIdEstado}>
                                    <option value="0" required>Selecione um Estado</option>
                                    {this.state.estados.map((estado) => {
                                        const { idEstado, descricao } = estado;
                                        return (<option key={idEstado} value={idEstado}>{descricao}</option>)
                                    })}
                                </select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="cidade">Cidade</Form.Label>
                                <select id="cidade" onChange={this.pegarIdCidade}>
                                    <option value="0" required>Selecione uma Cidade</option>
                                    {this.state.cidades.map((cidade) => {
                                        const { idCidade, descricao } = cidade;
                                        return (<option key={idCidade} value={idCidade}>{descricao}</option>)
                                    })}
                                </select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Referência</Form.Label>
                                <Form.Control id="txtReferencia" type="text" placeholder="Digite a referência" value={this.state.referencia} onChange={this.atualizarReferencia} />
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