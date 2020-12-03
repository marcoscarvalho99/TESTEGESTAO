const { Promise, resolve, reject } = require('bluebird')
const AppDAO = require('./dao')
const ProjectRepository = require('./src/Service/projeto_repository')
const TaskRepository = require('./src/Service/tarefa_repository')

const dao = new AppDAO('./src/database/database.sqlite3')
const projectRepo = new ProjectRepository(dao)
const taskRepo = new TaskRepository(dao)

class Main {
    constructor() {

    }

    lerbanco() {
        new Promise((resolve, reject) => {

            dao.db.all(`SELECT * FROM tasks`, [], (err, rows) => {

                if (err) {
                    reject(err);
                } else {
                    console.log(rows)
                    resolve(rows)
                }
            })
        })

    }
    teste(n) {
        this.lerbanco();
        return n;

    }

    async cadastrarProjeto(nome = "em branco", duracao = 0, status = 1) {

        try {
            await projectRepo.createTable();
            let { id } = await projectRepo.create(nome, duracao, status);
            return id;
        } catch (err) {
            console.log(err)
        }

    }


    async cadastrarTarefa(name, duration, description, isComplete, projetoId) {
        let res = "";
        //  this.lerbanco();
        try {
            let projeto = await projectRepo.getById(projetoId);
            //console.log(projeto.duration);
            if (projeto.duration > 800 || projeto === null) {

                return 'não foi possivel cadastrar a tarefa';

            }



            await taskRepo.createTable();
            await taskRepo.create(name, duration, description, isComplete, projetoId);

            if (isComplete === 0) {
                projeto.duration += duration;
                await projectRepo.update(projeto);

                return 'tarefa cadastrada';


            }



        } catch (err) {
            console.log(err);
        }

        // return "doeodod"

    }

    async tarefaPrioritaria(idProjeto) {
        let tarefas = await projectRepo.getTasks(idProjeto);
        let maior = { 'duration': -1 };
        tarefas.forEach(element => {

            if (element.isComplete === 0) {
                if (maior.duration < element.duration)
                    maior = element;
            }


        });

        if (maior.duration === -1) {
            return "nenhuma tarefa prioritaria";
        }

        return maior.name;

    }

    async projetoPrioritario(id) {
        try {
            let tasks = await taskRepo.getAll(id);
            let project = await projectRepo.getById(id)
            let complete = 0;

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].isComplete === 1) {
                    complete++;
                }

            }

            let calc = project.duration * 4;
            calc += (complete / tasks.length * 100) * 2;



            return parseInt(calc / 6);

        } catch (error) {
            console.log(error)
        }

    }



    async desabilitar(idProjeto) {

        let projeto = await projectRepo.getById(idProjeto);

        if (projeto.status === 0) {

            return " projeto já estava desabilitado";
        }

        if (projeto.duration === 0) {

            projeto.status = 1;
            await projectRepo.update(projeto);
            return " projeto  desabilitado";
        }

        return "projeto ainda habilitado";

    }

    async createTask(name, duration, description, isComplete, projectId) {
        try {
            let project = await projectRepo.getById(projectId);
            if (project.duration > 800 || project === null) {
                return 'falha';
            }

            await taskRepo.createTable();
            let result = await taskRepo.create(name, duration, description, isComplete, projectId);

            if (isComplete === 0) {
                project.duration += duration;
                await projectRepo.update(project);
            }
            return result.id
        } catch (err) {
            console.log(err)
        }

    }

    //Segundo teste e Terceiro Teste
    async priorityTask(id) {
        let tasks = await taskRepo.getAll(id);
        let aux = { 'duration': null }
        tasks.forEach(element => {
            if (aux.duration === null && element.isComplete === 0) {
                aux = element;
            } else if (aux.duration < element.duration && element.isComplete === 0) {
                aux = element;
            }
        })
        if (aux.duration === null) {
            return "Nenhuma tarefa prioritaria foi encontrada."
        }
        return aux.name;
    }


    //Primeiro teste
    createProject(name, duration = 0, status = 0) {
        try {
            projectRepo.createTable();
            let { id } = projectRepo.create(name, duration, status);
            return id;
        } catch (err) {
            console.log(err)
        }
    }


    //Quarto Teste
    async priorityProject(id) {
        try {
            let tasks = await taskRepo.getAll(id);
            let project = await projectRepo.getById(id)
            let complete = 0;
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].isComplete === 1) {
                    complete++;
                }

            }

            let calc = project.duration * 4;
            calc += (complete / tasks.length * 100) * 2;
            return parseInt(calc / 6)
        } catch (error) {
            console.log(error)
        }
    }

    //Quinto Teste
    async taskCompleteAll(tasksIds) {
        try {
            for (let i = 0; i < tasksIds.length; i++) {
                let task = await taskRepo.getById(tasksIds[i])
                task.isComplete = 1;
                await taskRepo.update(task)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async disableProject(id) {
        let project = await projectRepo.getById(id);
        if (project.duration === 0) {
            project.status = 1;
            await projectRepo.update(project)
            return 'Sucesso'
        } else {
            return 'Falha'
        }
    }

    async resetDB() {
        await projectRepo.dropTable()
        await taskRepo.dropTable()
    }
}


module.exports = Main