let Main = require('../main');

let p;
let data;
beforeEach(() => {
    p = new Main();
})

test("teste cadastro  projeto", async () => {

    expect(await p.cadastrarProjeto("projeto de gestão")).toBe(1);

})



test("teste cadastro simples de projeto e tarefa", async () => {

    data = await p.cadastrarProjeto("projeto de gestão2");

    expect(await p.cadastrarTarefa("tarefa1", 200, "executandotarefa1", 0, 2)).toBe("tarefa cadastrada");
    await p.resetDB()
})

test("teste1  de excesso de tarefas demonstrando o erro", async () => {

    data = await p.cadastrarProjeto("projeto de gestão");
    await p.cadastrarTarefa("tarefa1", 200, "executandotarefa1", 0, data)
    await p.cadastrarTarefa("tarefa2", 200, "executandotarefa2", 0, data)
    await p.cadastrarTarefa("tarefa3", 200, "executandotarefa3", 0, data)
    await p.cadastrarTarefa("tarefa4", 200, "executandotarefa4", 0, data)
    await p.cadastrarTarefa("tarefa4", 200, "executandotarefa4", 0, data)
    await p.cadastrarTarefa("tarefa4", 200, "executandotarefa4", 0, data)
    //await p.lerbanco();
    expect(await p.cadastrarTarefa("tarefa5", 200, "executandotarefa5", 0, data)).toBe('não foi possivel cadastrar a tarefa');
    await p.resetDB()
})

//teste2
test("teste de tarefa", async () => {

    data = await p.cadastrarProjeto("projeto de gestão3");
    await p.cadastrarTarefa("tarefa2", 200, "executandotarefa1", 0, data);
    await p.cadastrarTarefa("tarefa1", 100, "executandotarefa1", 0, data);
    await p.cadastrarTarefa("tarefa3", 300, "executandotarefa1", 1, data);
    expect(await p.tarefaPrioritaria(data)).toBe("tarefa2");
    await p.resetDB()
})

//teste3
test("teste de tarefa", async () => {

    data = await p.cadastrarProjeto("projeto de gestão3");
    await p.cadastrarTarefa("tarefa2", 200, "executandotarefa1", 1, data);
    await p.cadastrarTarefa("tarefa1", 100, "executandotarefa1", 1, data);
    await p.cadastrarTarefa("tarefa3", 300, "executandotarefa1", 1, data);
    expect(await p.tarefaPrioritaria(data)).toBe("nenhuma tarefa prioritaria");
    await p.resetDB()
})
//4
test("teste de tarefa", async () => {

    data = await p.cadastrarProjeto("projeto de gestão3");
    await p.cadastrarTarefa("tarefa2", 200, "executandotarefa1", 0, data);
    await p.cadastrarTarefa("tarefa1", 100, "executandotarefa1", 1, data);
    await p.cadastrarTarefa("tarefa3", 300, "executandotarefa1", 1, data);

    expect(await p.projetoPrioritario(data)).toBe(155);
    await p.resetDB()
})

//5

test("teste de tarefa", async () => {

    data = await p.cadastrarProjeto("projeto de gestão3");
    await p.cadastrarTarefa("tarefa2", 200, "executandotarefa1", 1, data);
    await p.cadastrarTarefa("tarefa1", 100, "executandotarefa1", 1, data);
    await p.cadastrarTarefa("tarefa3", 300, "executandotarefa1", 1, data);

    expect(await p.desabilitar(data)).toBe(" projeto  desabilitado");
    await p.resetDB()
})


