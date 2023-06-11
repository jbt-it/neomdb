// TraineeTection internal projects and members of all trainee gernerations

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React, { useState, useContext } from "react";

function createData(name: string, Kickoff: string, Angebot: boolean, ZP: string, AP: string) {
  return { name, Kickoff, Angebot, ZP, AP };
}

const rows = [
  createData("BDSU Contolling", "03.06.2023", true, "", ""),
  createData("Imagefilm", "237", true, "", ""),
  createData("HeyAlter", "", true, "", ""),
];

const TraineeSection = () => {
  return (
    <div>
      <div className="content-page">
        <TableContainer component={Paper}>
          <Table style={{ minWidth: 400 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell>Traineegeneration Sommersemester 2023 </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left">Internes Projekt</TableCell>
                <TableCell align="right">Kick-Off</TableCell>
                <TableCell align="right">Angebot abgegeben</TableCell>
                <TableCell align="right">ZP</TableCell>
                <TableCell align="right">AP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="right">{row.Kickoff}</TableCell>
                  <TableCell align="right">{row.Angebot}</TableCell>
                  <TableCell align="right">{row.ZP}</TableCell>
                  <TableCell align="right">{row.AP}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default TraineeSection;
