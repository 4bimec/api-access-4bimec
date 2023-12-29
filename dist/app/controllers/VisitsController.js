"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _Visits = require('../models/Visits'); var _Visits2 = _interopRequireDefault(_Visits);
class VisitsController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        rg: Yup.string(),
        cpf: Yup.string().min(14,"Mínimo 11 números").max(14, "Máximo 11 números"),
        phone: Yup.string(),
        email: Yup.string().email(),
        birth: Yup.string(),
        gener: Yup.string(),
        address: Yup.string(),
        numberhouse: Yup.string(),
        zipcode: Yup.string(),
        namemother: Yup.string(),
        namefather: Yup.string(),
      })

      try {
        await schema.validateSync(request.body, {
          abortEarly: false,
        })
      } catch (err) {
        return response.status(400).json({
          error: err.errors,
        })
      }

      const { filename: path } = request.file
    
      const {
        name,
        rg,
        cpf,
        phone,
        email,
        gener,
        birth,
        address,
        numberhouse,
        zipcode,
        namemother,
        namefather,
      } = request.body


      const existingVisitCpf = await _Visits2.default.findOne({
        where: {
          cpf: cpf,
        },
      });
  
      if (existingVisitCpf) {
        return response.status(400).json({ message: "CPF já cadastrado!" });
      }
  
    const validNames = (propsEntry) => {
      return propsEntry
      .toLowerCase() 
      .replace(/\b\w/g, (l) => l.toUpperCase());
    }
   
    const normalizedData = {
      name: validNames(name),
      rg, 
      cpf,
      phone,
      email: email.toLowerCase(),
      gener,
      birth,
      address: validNames(address),
      numberhouse,
      zipcode,
      namemother: validNames(namemother),
      namefather: validNames(namefather),
      path,
    };

    const people = await _Visits2.default.create(normalizedData);

      return (
        response.status(201).json(
          people
        )
      )
    } catch (error) {
      console.log("Erro ao criar, verique e tente novamente!", error)
    }
  }

  async index(req, resp) {
    try {
      const allPeopleRegisters = await _Visits2.default.findAll()

      return resp.json(allPeopleRegisters)
    } catch (error) {
      console.log("Erro ao buscar todas as pessoas cadastradas", error)
    }
  }

  async delete(req, resp) {
    try {
      const { id } = req.params
      const peopleId = await _Visits2.default.findByPk(id)
      peopleId.destroy({ id })
      return resp.status(200).json({ message: "Pessoa deletada com sucesso!" })
    } catch (error) {
      console.log({ message: "Pessoa deletada com sucesso!" }, error)
    }
  }

  async update(req, resp) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        rg: Yup.string(),
        cpf: Yup.string(),
        phone: Yup.string(),
        email: Yup.string().email(),
        birth: Yup.string(),
        gener: Yup.string(),
        address: Yup.string(),
        numberhouse: Yup.string(),
        zipcode: Yup.string(),
        namemother: Yup.string(),
        namefather: Yup.string(),
      })

      try {
        await schema.validateSync(req.body, {
          abortEarly: false,
        })
      } catch (err) {
        return resp.status(400).json({
          error: err.errors,
        })
      }


      const { id } = req.params
      const visit = await _Visits2.default.findByPk(id)

      if (!visit) {
        return resp.status(401).json({
          message: "Pessoa não existe",
        })
      }

      let path
      if (req.file) {
        path = req.file.filename
      }

      const {
        name,
        rg,
        cpf,
        phone,
        email,
        gener,
        birth,
        address,
        numberhouse,
        zipcode,
        namemother,
        namefather,
      } = req.body


    const validNames = (propsEntry) => {
      return propsEntry
      .toLowerCase() 
      .replace(/\b\w/g, (l) => l.toUpperCase());
    }
   
      await _Visits2.default.update(
        {
          name: validNames(name),
          rg, 
          cpf,
          phone,
          email: email.toLowerCase(),
          gener,
          birth,
          address: validNames(address),
          numberhouse,
          zipcode,
          namemother: validNames(namemother),
          namefather: validNames(namefather),
          path,
        },
        {
          where: {
            id,
          },
        }
      )

      return resp.status(200).json({
        message: "Pessoa editada com sucesso!",
      })
    } catch (err) {
      console.log(err)
    }
  }
}

exports. default = new VisitsController()
